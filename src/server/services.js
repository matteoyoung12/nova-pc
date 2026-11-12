import crypto from "node:crypto";
import { promisify } from "node:util";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "./errors.js";
import {
  ComponentFactory,
  PcBuild,
  PowerEstimator,
  createRules,
  DomainValidationError,
} from "../shared/domain.js";
const scrypt = promisify(crypto.scrypt);
export class PasswordHasher {
  async hash(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = await scrypt(password, salt, 64);
    return { salt, hash: hash.toString("hex") };
  }
  async verify(password, salt, hash) {
    const candidate = await scrypt(password, salt, 64);
    return crypto.timingSafeEqual(candidate, Buffer.from(hash, "hex"));
  }
}
export class RateLimiter {
  #attempts = new Map();
  check(key) {
    const now = Date.now(),
      windowMs = 15 * 60 * 1000,
      limit = 5;
    const attempts = (this.#attempts.get(key) ?? []).filter(
      (time) => time > now - windowMs,
    );
    if (attempts.length >= limit) return false;
    attempts.push(now);
    this.#attempts.set(key, attempts);
    return true;
  }
}
export class AuthService {
  #users;
  #sessions;
  #hasher;
  #ttl;
  constructor(users, sessions, hasher, ttl) {
    this.#users = users;
    this.#sessions = sessions;
    this.#hasher = hasher;
    this.#ttl = ttl;
  }
  async register({ email, password, name }) {
    const normalized = String(email ?? "")
        .trim()
        .toLowerCase(),
      displayName = String(name ?? "").trim();
    const fields = {};
    if (!/^\S+@\S+\.\S+$/.test(normalized))
      fields.email = "Введите корректный email.";
    if (password?.length < 8 || password?.length > 128)
      fields.password = "Пароль должен содержать от 8 до 128 символов.";
    if (!displayName || displayName.length > 60)
      fields.name = "Введите имя до 60 символов.";
    if (Object.keys(fields).length)
      throw new ValidationError("Исправьте поля формы.", fields);
    if (this.#users.findByEmail(normalized))
      throw new ConflictError("Пользователь с таким email уже зарегистрирован");
    const credentials = await this.#hasher.hash(password);
    return this.#users.create({
      id: crypto.randomUUID(),
      email: normalized,
      hash: credentials.hash,
      salt: credentials.salt,
      name: displayName,
      createdAt: Date.now(),
    });
  }
  async login({ email, password }) {
    const user = this.#users.findByEmail(
      String(email ?? "")
        .trim()
        .toLowerCase(),
    );
    if (
      !user ||
      !(await this.#hasher.verify(
        password ?? "",
        user.password_salt,
        user.password_hash,
      ))
    )
      throw new AuthenticationError();
    return { id: user.id, email: user.email, displayName: user.display_name };
  }
  createSession(userId) {
    const token = crypto.randomBytes(32).toString("base64url");
    this.#sessions.create({
      id: crypto.randomUUID(),
      userId,
      tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
      expiresAt: Date.now() + this.#ttl,
      createdAt: Date.now(),
    });
    return token;
  }
  getUser(token) {
    if (!token) return null;
    return this.#sessions.findValid(
      crypto.createHash("sha256").update(token).digest("hex"),
      Date.now(),
    );
  }
  logout(token) {
    if (token)
      this.#sessions.remove(
        crypto.createHash("sha256").update(token).digest("hex"),
      );
  }
}
export class BuildService {
  #builds;
  #catalog;
  #factory = new ComponentFactory();
  #power = new PowerEstimator();
  #rules = createRules(this.#power);
  constructor(builds, catalog) {
    this.#builds = builds;
    this.#catalog = catalog;
  }
  #validate(name, componentIds) {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 60)
      throw new ValidationError(
        "Название должно содержать от 1 до 60 символов.",
        { name: "Введите название от 1 до 60 символов." },
      );
    if (!Array.isArray(componentIds) || componentIds.length > 12)
      throw new ValidationError("Некорректный состав сборки.");
    const rows = this.#catalog.findMany(componentIds);
    if (rows.length !== componentIds.length)
      throw new ValidationError("Выбран неизвестный компонент.");
    const build = new PcBuild();
    try {
      rows.forEach((row) => build.add(this.#factory.create(row)));
    } catch (error) {
      if (error instanceof DomainValidationError)
        throw new ValidationError(error.message);
      throw error;
    }
    const failed = this.#rules
      .map((rule) => rule.check(build))
      .filter((item) => item.status === "failed");
    if (failed.length)
      throw new ValidationError("Сборка содержит несовместимые компоненты.", {
        components: failed.map((item) => item.message).join(" "),
      });
    return componentIds;
  }
  list(userId) {
    return this.#builds.list(userId);
  }
  get(userId, id) {
    const build = this.#builds.find(userId, id);
    if (!build) throw new NotFoundError();
    return build;
  }
  create(userId, input) {
    const ids = this.#validate(input.name, input.componentIds);
    try {
      return this.#builds.create(userId, input.name.trim(), ids);
    } catch (error) {
      if (String(error).includes("UNIQUE"))
        throw new ConflictError("Сборка с таким названием уже существует.");
      throw error;
    }
  }
  update(userId, id, input) {
    const ids = this.#validate(input.name, input.componentIds);
    try {
      const build = this.#builds.update(userId, id, input.name.trim(), ids);
      if (!build) throw new NotFoundError();
      return build;
    } catch (error) {
      if (String(error).includes("UNIQUE"))
        throw new ConflictError("Сборка с таким названием уже существует.");
      throw error;
    }
  }
  duplicate(userId, id) {
    const source = this.get(userId, id);
    let name = `${source.name} — копия`,
      number = 2;
    while (true) {
      try {
        return this.#builds.duplicate(userId, id, name);
      } catch (error) {
        if (!String(error).includes("UNIQUE")) throw error;
        name = `${source.name} — копия ${number++}`;
      }
    }
  }
  remove(userId, id) {
    if (!this.#builds.remove(userId, id)) throw new NotFoundError();
  }
}
