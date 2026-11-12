import { StorageError } from "../domain/errors.js";
export class BuildRepository {
  #storage;
  #key;
  constructor(storage, key = "pc-builder-builds-v1") {
    this.#storage = storage;
    this.#key = key;
  }
  loadAll() {
    const raw = this.#storage.getItem(this.#key);
    if (!raw) return [];
    try {
      const builds = JSON.parse(raw);
      if (!Array.isArray(builds)) throw new Error("Ожидался массив");
      return builds;
    } catch (error) {
      throw new StorageError("Сохранённые сборки повреждены.", error);
    }
  }
  saveAll(builds) {
    try {
      this.#storage.setItem(this.#key, JSON.stringify(builds));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError("Не удалось сохранить сборки.", error);
    }
  }
}
