import { ValidationError } from "./errors.js";
export class Component {
  #id;
  #name;
  #price;
  #powerDraw;
  #performance;
  #specs;
  constructor({ id, name, price, powerDraw, performance, specs = {} }) {
    if (new.target === Component)
      throw new Error("Component — абстрактный класс.");
    this.#id = id;
    this.#name = name;
    this.#price = price;
    this.#powerDraw = powerDraw;
    this.#performance = performance;
    this.#specs = Object.freeze({ ...specs });
  }
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get price() {
    return this.#price;
  }
  get powerDraw() {
    return this.#powerDraw;
  }
  get performance() {
    return this.#performance;
  }
  get specs() {
    return this.#specs;
  }
  get category() {
    throw new Error("Категория должна быть определена наследником.");
  }
  toJSON() {
    return { id: this.#id, category: this.category };
  }
}
export class CpuComponent extends Component {
  get category() {
    return "cpu";
  }
}
export class GpuComponent extends Component {
  get category() {
    return "gpu";
  }
}
export class MotherboardComponent extends Component {
  get category() {
    return "motherboard";
  }
}
export class MemoryComponent extends Component {
  get category() {
    return "memory";
  }
}
export class StorageComponent extends Component {
  get category() {
    return "storage";
  }
}
export class PsuComponent extends Component {
  get category() {
    return "psu";
  }
}
export class CaseComponent extends Component {
  get category() {
    return "case";
  }
}
export class CoolerComponent extends Component {
  get category() {
    return "cooler";
  }
}
export class PcBuild {
  #slots;
  static SINGLE_CATEGORIES = [
    "cpu",
    "gpu",
    "motherboard",
    "psu",
    "case",
    "cooler",
  ];
  static MULTIPLE_CATEGORIES = ["memory", "storage"];
  constructor(slots = {}) {
    this.#slots = {
      cpu: null,
      gpu: null,
      motherboard: null,
      memory: [],
      storage: [],
      psu: null,
      case: null,
      cooler: null,
      ...slots,
    };
  }
  get(category) {
    return Array.isArray(this.#slots[category])
      ? [...this.#slots[category]]
      : this.#slots[category];
  }
  get entries() {
    return Object.entries(this.#slots);
  }
  get allComponents() {
    return Object.values(this.#slots).flatMap((value) =>
      Array.isArray(value) ? value : value ? [value] : [],
    );
  }
  add(component) {
    if (!component?.category)
      throw new ValidationError("Некорректный компонент.", "component");
    const category = component.category;
    if (PcBuild.SINGLE_CATEGORIES.includes(category))
      this.#slots[category] = component;
    else if (PcBuild.MULTIPLE_CATEGORIES.includes(category))
      this.#slots[category] = [...this.#slots[category], component];
    else
      throw new ValidationError(
        "Неизвестная категория компонента.",
        "component",
      );
  }
  remove(category, id) {
    if (PcBuild.MULTIPLE_CATEGORIES.includes(category))
      this.#slots[category] = this.#slots[category].filter(
        (component) => component.id !== id,
      );
    else if (PcBuild.SINGLE_CATEGORIES.includes(category))
      this.#slots[category] = null;
    else
      throw new ValidationError(
        "Неизвестная категория компонента.",
        "component",
      );
  }
  clear() {
    this.#slots = {
      cpu: null,
      gpu: null,
      motherboard: null,
      memory: [],
      storage: [],
      psu: null,
      case: null,
      cooler: null,
    };
  }
  toJSON() {
    return Object.fromEntries(
      this.entries.map(([category, value]) => [
        category,
        Array.isArray(value)
          ? value.map((component) => component.id)
          : (value?.id ?? null),
      ]),
    );
  }
}
