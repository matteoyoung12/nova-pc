export class UserRepository {
  #db;
  constructor(db) {
    this.#db = db;
  }
  findByEmail(email) {
    return this.#db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }
  findById(id) {
    return this.#db
      .prepare(
        "SELECT id,email,display_name,created_at FROM users WHERE id = ?",
      )
      .get(id);
  }
  create(user) {
    this.#db
      .prepare(
        "INSERT INTO users (id,email,password_hash,password_salt,display_name,created_at) VALUES (@id,@email,@hash,@salt,@name,@createdAt)",
      )
      .run(user);
    return this.findById(user.id);
  }
}
export class SessionRepository {
  #db;
  constructor(db) {
    this.#db = db;
  }
  create(session) {
    this.#db
      .prepare(
        "INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at) VALUES (@id,@userId,@tokenHash,@expiresAt,@createdAt)",
      )
      .run(session);
  }
  findValid(hash, now) {
    return this.#db
      .prepare(
        "SELECT users.id,users.email,users.display_name FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires_at>?",
      )
      .get(hash, now);
  }
  remove(hash) {
    this.#db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hash);
  }
}
export class CatalogRepository {
  #db;
  constructor(db) {
    this.#db = db;
  }
  count() {
    return this.#db.prepare("SELECT COUNT(*) AS count FROM components").get()
      .count;
  }
  seed(items) {
    const insert = this.#db.prepare(
      "INSERT INTO components (id,category,name,price_rub,performance_score,power_draw_watts,specs) VALUES (@id,@category,@name,@price,@performance,@power,@specs)",
    );
    this.#db.transaction((rows) => rows.forEach((row) => insert.run(row)))(
      items,
    );
  }
  query({ category, search, sort }) {
    const order =
      sort === "price-asc"
        ? "price_rub ASC"
        : sort === "price-desc"
          ? "price_rub DESC"
          : "performance_score DESC";
    return this.#db
      .prepare(
        `SELECT * FROM components WHERE (?='' OR category=?) AND lower(name) LIKE ? ORDER BY ${order}`,
      )
      .all(category ?? "", category ?? "", `%${(search ?? "").toLowerCase()}%`);
  }
  findMany(ids) {
    if (!ids.length) return [];
    return this.#db
      .prepare(
        `SELECT * FROM components WHERE id IN (${ids.map(() => "?").join(",")})`,
      )
      .all(...ids);
  }
}
export class BuildRepository {
  #db;
  constructor(db) {
    this.#db = db;
  }
  list(userId) {
    return this.#db
      .prepare(
        "SELECT id,name,created_at,updated_at FROM builds WHERE user_id=? ORDER BY updated_at DESC",
      )
      .all(userId);
  }
  find(userId, id) {
    const build = this.#db
      .prepare(
        "SELECT id,name,created_at,updated_at FROM builds WHERE id=? AND user_id=?",
      )
      .get(id, userId);
    if (!build) return null;
    build.items = this.#db
      .prepare(
        "SELECT component_id,slot_index FROM build_items WHERE build_id=? ORDER BY slot_index",
      )
      .all(id);
    return build;
  }
  create(userId, name, items) {
    const id = crypto.randomUUID(),
      now = Date.now();
    this.#write({ id, userId, name, items, now, existing: false });
    return this.find(userId, id);
  }
  update(userId, id, name, items) {
    if (!this.find(userId, id)) return null;
    this.#write({ id, userId, name, items, now: Date.now(), existing: true });
    return this.find(userId, id);
  }
  #write({ id, userId, name, items, now, existing }) {
    const insertItem = this.#db.prepare(
      "INSERT INTO build_items (build_id,component_id,slot_index) VALUES (?,?,?)",
    );
    this.#db.transaction(() => {
      if (existing) {
        this.#db
          .prepare(
            "UPDATE builds SET name=?,updated_at=? WHERE id=? AND user_id=?",
          )
          .run(name, now, id, userId);
        this.#db.prepare("DELETE FROM build_items WHERE build_id=?").run(id);
      } else
        this.#db
          .prepare(
            "INSERT INTO builds (id,user_id,name,created_at,updated_at) VALUES (?,?,?,?,?)",
          )
          .run(id, userId, name, now, now);
      items.forEach((componentId, index) =>
        insertItem.run(id, componentId, index),
      );
    })();
  }
  duplicate(userId, id, name) {
    const source = this.find(userId, id);
    if (!source) return null;
    return this.create(
      userId,
      name,
      source.items.map((item) => item.component_id),
    );
  }
  remove(userId, id) {
    return (
      this.#db
        .prepare("DELETE FROM builds WHERE id=? AND user_id=?")
        .run(id, userId).changes > 0
    );
  }
}
