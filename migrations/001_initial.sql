CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, display_name TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS components (id TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, price_rub INTEGER NOT NULL, performance_score INTEGER NOT NULL, power_draw_watts INTEGER NOT NULL, specs TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS builds (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE(user_id, name));
CREATE TABLE IF NOT EXISTS build_items (build_id TEXT NOT NULL REFERENCES builds(id) ON DELETE CASCADE, component_id TEXT NOT NULL REFERENCES components(id), slot_index INTEGER NOT NULL, PRIMARY KEY (build_id, component_id, slot_index));
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_builds_user ON builds(user_id);
