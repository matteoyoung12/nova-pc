CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL, price_rub INTEGER NOT NULL, image_tone TEXT NOT NULL, specs TEXT NOT NULL, is_active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS cart_items (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 5), PRIMARY KEY(user_id, product_id));
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), total_rub INTEGER NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS order_items (order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, price_rub INTEGER NOT NULL, PRIMARY KEY(order_id, product_id));
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
