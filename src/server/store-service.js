import { NotFoundError, ValidationError } from "./errors.js";
const mapProduct = (product) => ({
  ...product,
  specs: JSON.parse(product.specs),
});
export class StoreService {
  #products;
  #cart;
  constructor(products, cart) {
    this.#products = products;
    this.#cart = cart;
  }
  listProducts() {
    return this.#products.list().map(mapProduct);
  }
  cart(userId) {
    const items = this.#cart.get(userId);
    return {
      items,
      total: items.reduce(
        (sum, item) => sum + item.price_rub * item.quantity,
        0,
      ),
    };
  }
  addToCart(userId, productId) {
    if (!this.#products.find(productId))
      throw new NotFoundError("Товар не найден.");
    this.#cart.add(userId, productId);
    return this.cart(userId);
  }
  removeFromCart(userId, productId) {
    this.#cart.remove(userId, productId);
    return this.cart(userId);
  }
  checkout(userId) {
    const items = this.#cart.get(userId);
    if (!items.length) throw new ValidationError("Корзина пока пуста.");
    return this.#cart.checkout(userId, items);
  }
}
