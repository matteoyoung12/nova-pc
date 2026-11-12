import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import {
  AuthenticationError,
  ForbiddenError,
  HttpError,
  RateLimitError,
} from "./errors.js";
const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("=").map(decodeURIComponent))
      .filter(([key]) => key),
  );
export const createApp = ({
  config,
  authService,
  buildService,
  catalogRepository,
  storeService,
  rateLimiter,
  publicPath,
}) => {
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    next();
  });
  app.use(express.json({ limit: "10kb" }));
  app.use((req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
    const origin = req.get("origin") ?? req.get("referer");
    if (!origin) return next();
    try {
      if (new URL(origin).host !== req.get("host")) throw new Error();
      next();
    } catch {
      next(new ForbiddenError());
    }
  });
  app.use((req, res, next) => {
    const token = parseCookies(req.headers.cookie).pc_session;
    req.user = authService.getUser(token);
    req.sessionToken = token;
    next();
  });
  const requireAuth = (req, res, next) =>
    req.user ? next() : next(new AuthenticationError());
  const setSession = (res, token) =>
    res.cookie("pc_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.nodeEnv === "production",
      maxAge: config.sessionTtlMs,
      path: "/",
    });
  const limited = (req, res, next) => {
    const key = `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`;
    return rateLimiter.check(key) ? next() : next(new RateLimitError());
  };
  app.post("/api/auth/register", limited, async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      setSession(res, authService.createSession(user.id));
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/auth/login", limited, async (req, res, next) => {
    try {
      const user = await authService.login(req.body);
      setSession(res, authService.createSession(user.id));
      res.json({ user });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/auth/logout", requireAuth, (req, res) => {
    authService.logout(req.sessionToken);
    res.clearCookie("pc_session", { path: "/" }).status(204).end();
  });
  app.get("/api/auth/me", (req, res) => res.json({ user: req.user ?? null }));
  app.get("/api/catalog", (req, res) =>
    res.json({ items: catalogRepository.query(req.query) }),
  );
  app.get("/api/products", (req, res) =>
    res.json({ items: storeService.listProducts() }),
  );
  app.get("/api/cart", requireAuth, (req, res) =>
    res.json(storeService.cart(req.user.id)),
  );
  app.post("/api/cart", requireAuth, (req, res, next) => {
    try {
      res
        .status(201)
        .json(storeService.addToCart(req.user.id, req.body.productId));
    } catch (error) {
      next(error);
    }
  });
  app.delete("/api/cart/:productId", requireAuth, (req, res, next) => {
    try {
      res.json(storeService.removeFromCart(req.user.id, req.params.productId));
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/orders", requireAuth, (req, res, next) => {
    try {
      res.status(201).json({ item: storeService.checkout(req.user.id) });
    } catch (error) {
      next(error);
    }
  });
  app.get("/api/builds", requireAuth, (req, res) =>
    res.json({ items: buildService.list(req.user.id) }),
  );
  app.post("/api/builds", requireAuth, (req, res, next) => {
    try {
      res
        .status(201)
        .json({ item: buildService.create(req.user.id, req.body) });
    } catch (error) {
      next(error);
    }
  });
  app.get("/api/builds/:id", requireAuth, (req, res, next) => {
    try {
      res.json({ item: buildService.get(req.user.id, req.params.id) });
    } catch (error) {
      next(error);
    }
  });
  app.put("/api/builds/:id", requireAuth, (req, res, next) => {
    try {
      res.json({
        item: buildService.update(req.user.id, req.params.id, req.body),
      });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/builds/:id/duplicate", requireAuth, (req, res, next) => {
    try {
      res
        .status(201)
        .json({ item: buildService.duplicate(req.user.id, req.params.id) });
    } catch (error) {
      next(error);
    }
  });
  app.delete("/api/builds/:id", requireAuth, (req, res, next) => {
    try {
      buildService.remove(req.user.id, req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  app.use("/shared", express.static(path.join(publicPath, "../src/shared")));
  app.use("/app", express.static(path.join(publicPath, "app")));
  app.get(
    [
      "/",
      "/builder",
      "/configurator",
      "/login",
      "/register",
      "/account",
      "/builds",
    ],
    (req, res) => res.sendFile(path.join(publicPath, "app", "index.html")),
  );
  app.use(express.static(publicPath));
  app.use((error, req, res, next) => {
    const known = error instanceof HttpError;
    if (!known) console.error(error);
    res.status(known ? error.status : 500).json({
      error: {
        code: known ? error.code : "INTERNAL_ERROR",
        message: known ? error.message : "Внутренняя ошибка сервера.",
        ...(error.fields ? { fields: error.fields } : {}),
      },
    });
  });
  return app;
};
