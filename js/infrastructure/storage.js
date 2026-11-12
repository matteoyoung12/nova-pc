import { StorageError } from "../domain/errors.js";
export class StorageAdapter {
  getItem() {
    throw new Error("Метод getItem должен быть реализован.");
  }
  setItem() {
    throw new Error("Метод setItem должен быть реализован.");
  }
}
export class LocalStorageAdapter extends StorageAdapter {
  #storage;
  constructor(storage) {
    super();
    this.#storage = storage;
  }
  getItem(key) {
    try {
      return this.#storage.getItem(key);
    } catch (error) {
      throw new StorageError("Не удалось прочитать сохранённые данные.", error);
    }
  }
  setItem(key, value) {
    try {
      this.#storage.setItem(key, value);
    } catch (error) {
      throw new StorageError(
        "Не удалось сохранить изменения. Проверьте настройки хранилища браузера.",
        error,
      );
    }
  }
}
export class MemoryStorageAdapter extends StorageAdapter {
  #values = new Map();
  getItem(key) {
    return this.#values.get(key) ?? null;
  }
  setItem(key, value) {
    this.#values.set(key, value);
  }
}
