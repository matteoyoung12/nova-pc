export const CATEGORIES = [
  "cpu",
  "gpu",
  "motherboard",
  "memory",
  "storage",
  "psu",
  "case",
  "cooler",
];
export class DomainValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DomainValidationError";
  }
}
export class Component {
  #data;
  constructor(data) {
    if (new.target === Component) throw new Error("Абстрактный компонент.");
    this.#data = Object.freeze({
      ...data,
      specs:
        typeof data.specs === "string" ? JSON.parse(data.specs) : data.specs,
    });
  }
  get id() {
    return this.#data.id;
  }
  get name() {
    return this.#data.name;
  }
  get priceRub() {
    return this.#data.price_rub ?? this.#data.priceRub;
  }
  get powerDrawWatts() {
    return this.#data.power_draw_watts ?? this.#data.powerDrawWatts;
  }
  get performance() {
    return this.#data.performance_score ?? this.#data.performance;
  }
  get specs() {
    return this.#data.specs;
  }
  get category() {
    throw new Error("Категория определяется наследником.");
  }
  get categoryName() {
    return this.category;
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
const TYPES = {
  cpu: CpuComponent,
  gpu: GpuComponent,
  motherboard: MotherboardComponent,
  memory: MemoryComponent,
  storage: StorageComponent,
  psu: PsuComponent,
  case: CaseComponent,
  cooler: CoolerComponent,
};
export class ComponentFactory {
  create(record) {
    const Type = TYPES[record?.category];
    if (!Type)
      throw new DomainValidationError("Неизвестная категория компонента.");
    return new Type(record);
  }
}
export class PcBuild {
  #slots;
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
  get all() {
    return Object.values(this.#slots).flatMap((item) =>
      Array.isArray(item) ? item : item ? [item] : [],
    );
  }
  add(component) {
    if (!CATEGORIES.includes(component.category))
      throw new DomainValidationError(
        "Компонент нельзя поместить в эту категорию.",
      );
    if (["memory", "storage"].includes(component.category)) {
      const max = component.category === "memory" ? 4 : 3;
      if (this.#slots[component.category].length >= max)
        throw new DomainValidationError(`Лимит категории: ${max}.`);
      this.#slots[component.category] = [
        ...this.#slots[component.category],
        component,
      ];
    } else this.#slots[component.category] = component;
  }
  remove(category, id) {
    if (["memory", "storage"].includes(category))
      this.#slots[category] = this.#slots[category].filter(
        (item) => item.id !== id,
      );
    else this.#slots[category] = null;
  }
  toIds() {
    return Object.fromEntries(
      Object.entries(this.#slots).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value.map((item) => item.id)
          : (value?.id ?? null),
      ]),
    );
  }
}
export class PowerEstimator {
  static BASE_WATTS = 60;
  static RESERVE = 1.2;
  estimate(build) {
    const total = build.all.length
      ? PowerEstimator.BASE_WATTS +
        build.all.reduce((sum, item) => sum + item.powerDrawWatts, 0)
      : 0;
    const required = Math.ceil(total * PowerEstimator.RESERVE);
    const psu = build.get("psu");
    const headroom = psu && total ? psu.specs.wattage - total : null;
    return {
      total,
      required,
      headroom,
      status:
        headroom === null
          ? "neutral"
          : headroom < 0
            ? "failed"
            : headroom / psu.specs.wattage <= 0.2
              ? "warning"
              : "passed",
    };
  }
}
export class CompatibilityRule {
  check() {
    throw new Error("Реализуйте check.");
  }
}
const result = (id, status, message, category = null) => ({
  id,
  status,
  message,
  category,
});
export class CpuSocketRule extends CompatibilityRule {
  check(build) {
    const a = build.get("cpu"),
      b = build.get("motherboard");
    return !a || !b
      ? result("socket", "neutral", "Добавьте процессор и материнскую плату.")
      : a.specs.socket === b.specs.socket
        ? result("socket", "passed", `Сокет ${a.specs.socket} совпадает.`)
        : result(
            "socket",
            "failed",
            `${a.name} несовместим с ${b.name}.`,
            "motherboard",
          );
  }
}
export class MemoryTypeRule extends CompatibilityRule {
  check(build) {
    const memory = build.get("memory"),
      board = build.get("motherboard");
    if (!memory.length || !board)
      return result(
        "memory-type",
        "neutral",
        "Добавьте ОЗУ и материнскую плату.",
      );
    const bad = memory.find(
      (item) => item.specs.memoryType !== board.specs.memoryType,
    );
    return bad
      ? result(
          "memory-type",
          "failed",
          `${bad.name} не поддерживается ${board.name}.`,
          "memory",
        )
      : result("memory-type", "passed", "Тип ОЗУ поддерживается.");
  }
}
export class FormFactorRule extends CompatibilityRule {
  check(build) {
    const board = build.get("motherboard"),
      pcCase = build.get("case");
    if (!board || !pcCase)
      return result("form-factor", "neutral", "Добавьте плату и корпус.");
    return pcCase.specs.formFactors.includes(board.specs.formFactor)
      ? result("form-factor", "passed", "Форм-фактор подходит.")
      : result(
          "form-factor",
          "failed",
          `${board.name} не помещается в ${pcCase.name}.`,
          "case",
        );
  }
}
export class GpuLengthRule extends CompatibilityRule {
  check(build) {
    const gpu = build.get("gpu"),
      pcCase = build.get("case");
    if (!gpu || !pcCase)
      return result("gpu-length", "neutral", "Добавьте видеокарту и корпус.");
    return gpu.specs.length <= pcCase.specs.maxGpuLength
      ? result("gpu-length", "passed", "Длина видеокарты подходит.")
      : result(
          "gpu-length",
          "failed",
          `${gpu.name} длиннее лимита корпуса.`,
          "case",
        );
  }
}
export class CoolerHeightRule extends CompatibilityRule {
  check(build) {
    const cooler = build.get("cooler"),
      pcCase = build.get("case");
    if (!cooler || !pcCase || cooler.specs.type !== "tower")
      return result(
        "cooler-height",
        "neutral",
        "Добавьте башенный кулер и корпус.",
      );
    return cooler.specs.height <= pcCase.specs.maxCoolerHeight
      ? result("cooler-height", "passed", "Высота кулера подходит.")
      : result(
          "cooler-height",
          "failed",
          `${cooler.name} выше лимита корпуса.`,
          "case",
        );
  }
}
export class MemorySlotsRule extends CompatibilityRule {
  check(build) {
    const memory = build.get("memory"),
      board = build.get("motherboard");
    if (!memory.length || !board)
      return result(
        "memory-slots",
        "neutral",
        "Добавьте ОЗУ и материнскую плату.",
      );
    return memory.length <= board.specs.memorySlots
      ? result(
          "memory-slots",
          "passed",
          `Занято ${memory.length}/${board.specs.memorySlots} слотов.`,
        )
      : result(
          "memory-slots",
          "failed",
          "Превышено число слотов ОЗУ.",
          "memory",
        );
  }
}
export class PsuRule extends CompatibilityRule {
  #power;
  constructor(power) {
    super();
    this.#power = power;
  }
  check(build) {
    const estimate = this.#power.estimate(build),
      psu = build.get("psu");
    if (!psu || !estimate.total)
      return result("psu", "neutral", "Добавьте блок питания.");
    return psu.specs.wattage >= estimate.required
      ? result(
          "psu",
          "passed",
          `БП покрывает требуемые ${estimate.required} Вт.`,
        )
      : result(
          "psu",
          "failed",
          `БП ${psu.specs.wattage} Вт слабее требуемых ${estimate.required} Вт.`,
          "psu",
        );
  }
}
export const createRules = (power) => [
  new CpuSocketRule(),
  new MemoryTypeRule(),
  new FormFactorRule(),
  new GpuLengthRule(),
  new CoolerHeightRule(),
  new MemorySlotsRule(),
  new PsuRule(power),
];
