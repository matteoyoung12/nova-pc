import path from "node:path";
export const loadConfig = (env = process.env) => {
  const port = Number(env.PORT ?? 3000);
  const ttlDays = Number(env.SESSION_TTL_DAYS ?? 7);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT должен быть корректным номером порта.");
  if (!Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > 30)
    throw new Error("SESSION_TTL_DAYS должен быть от 1 до 30.");
  return {
    port,
    dbPath: path.resolve(env.DB_PATH ?? "./data/app.db"),
    nodeEnv: env.NODE_ENV ?? "development",
    sessionTtlMs: ttlDays * 24 * 60 * 60 * 1000,
  };
};
