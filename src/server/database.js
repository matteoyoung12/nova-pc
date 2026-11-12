import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
export class DatabaseManager {
  #db;
  constructor(dbPath) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.#db = new Database(dbPath);
    this.#db.pragma("foreign_keys = ON");
    this.#db.pragma("journal_mode = WAL");
  }
  get connection() {
    return this.#db;
  }
  migrate(migrationsPath) {
    const migrations = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();
    let version = this.#db.pragma("user_version", { simple: true });
    for (const file of migrations) {
      const nextVersion = Number(file.slice(0, 3));
      if (nextVersion <= version) continue;
      const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
      this.#db.transaction(() => {
        this.#db.exec(sql);
        this.#db.pragma(`user_version = ${nextVersion}`);
      })();
      version = nextVersion;
    }
  }
  close() {
    this.#db.close();
  }
}
