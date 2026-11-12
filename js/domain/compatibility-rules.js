export class CompatibilityRule {
  check() {
    throw new Error("Правило должно реализовать check.");
  }
}
const pending = (id, message) => ({
  id,
  passed: null,
  message,
  category: null,
});
export class CpuSocketCompatibilityRule extends CompatibilityRule {
  check(build) {
    const cpu = build.get("cpu");
    const board = build.get("motherboard");
    if (!cpu || !board)
      return pending(
        "cpu-socket",
        "Добавьте процессор и материнскую плату для проверки сокета.",
      );
    const passed = cpu.specs.socket === board.specs.socket;
    return {
      id: "cpu-socket",
      passed,
      category: passed ? null : "motherboard",
      message: passed
        ? `Сокет ${cpu.specs.socket} совпадает.`
        : `${cpu.name} (${cpu.specs.socket}) несовместим с ${board.name} (${board.specs.socket}).`,
    };
  }
}
export class MemoryTypeCompatibilityRule extends CompatibilityRule {
  check(build) {
    const memories = build.get("memory");
    const board = build.get("motherboard");
    if (!memories.length || !board)
      return pending(
        "memory-type",
        "Добавьте ОЗУ и материнскую плату для проверки типа памяти.",
      );
    const badMemory = memories.find(
      (memory) => memory.specs.memoryType !== board.specs.memoryType,
    );
    const passed = !badMemory;
    return {
      id: "memory-type",
      passed,
      category: passed ? null : "memory",
      message: passed
        ? `ОЗУ ${board.specs.memoryType} поддерживается платой.`
        : `${badMemory.name} не подходит: плата поддерживает ${board.specs.memoryType}.`,
    };
  }
}
export class MotherboardFormFactorRule extends CompatibilityRule {
  check(build) {
    const board = build.get("motherboard");
    const pcCase = build.get("case");
    if (!board || !pcCase)
      return pending(
        "form-factor",
        "Добавьте материнскую плату и корпус для проверки форм-фактора.",
      );
    const passed = pcCase.specs.supportedFormFactors.includes(
      board.specs.formFactor,
    );
    return {
      id: "form-factor",
      passed,
      category: passed ? null : "case",
      message: passed
        ? `${board.specs.formFactor} помещается в корпус.`
        : `${board.name} (${board.specs.formFactor}) не помещается в ${pcCase.name}.`,
    };
  }
}
export class GpuLengthCompatibilityRule extends CompatibilityRule {
  check(build) {
    const gpu = build.get("gpu");
    const pcCase = build.get("case");
    if (!gpu || !pcCase)
      return pending(
        "gpu-length",
        "Добавьте видеокарту и корпус для проверки длины.",
      );
    const passed = gpu.specs.length <= pcCase.specs.maxGpuLength;
    return {
      id: "gpu-length",
      passed,
      category: passed ? null : "case",
      message: passed
        ? `Видеокарта ${gpu.specs.length} мм помещается в корпус.`
        : `${gpu.name} (${gpu.specs.length} мм) длиннее лимита корпуса (${pcCase.specs.maxGpuLength} мм).`,
    };
  }
}
export class CoolerHeightCompatibilityRule extends CompatibilityRule {
  check(build) {
    const cooler = build.get("cooler");
    const pcCase = build.get("case");
    if (!cooler || !pcCase || cooler.specs.type !== "tower")
      return pending(
        "cooler-height",
        "Добавьте башенный кулер и корпус для проверки высоты.",
      );
    const passed = cooler.specs.height <= pcCase.specs.maxCoolerHeight;
    return {
      id: "cooler-height",
      passed,
      category: passed ? null : "case",
      message: passed
        ? `Кулер ${cooler.specs.height} мм помещается в корпус.`
        : `${cooler.name} (${cooler.specs.height} мм) выше лимита корпуса (${pcCase.specs.maxCoolerHeight} мм).`,
    };
  }
}
export class MemorySlotsCompatibilityRule extends CompatibilityRule {
  check(build) {
    const memories = build.get("memory");
    const board = build.get("motherboard");
    if (!memories.length || !board)
      return pending(
        "memory-slots",
        "Добавьте ОЗУ и материнскую плату для проверки слотов.",
      );
    const passed = memories.length <= board.specs.memorySlots;
    return {
      id: "memory-slots",
      passed,
      category: passed ? null : "memory",
      message: passed
        ? `${memories.length} из ${board.specs.memorySlots} слотов ОЗУ занято.`
        : `Выбрано ${memories.length} планок, а на плате только ${board.specs.memorySlots} слота.`,
    };
  }
}
export class PsuPowerCompatibilityRule extends CompatibilityRule {
  #powerEstimator;
  constructor(powerEstimator) {
    super();
    this.#powerEstimator = powerEstimator;
  }
  check(build) {
    const psu = build.get("psu");
    const power = this.#powerEstimator.estimate(build);
    if (!psu || !power.total)
      return pending(
        "psu-power",
        "Добавьте блок питания и компоненты для расчёта запаса мощности.",
      );
    const passed = psu.specs.wattage >= power.required;
    return {
      id: "psu-power",
      passed,
      category: passed ? null : "psu",
      message: passed
        ? `${psu.specs.wattage} Вт покрывает требуемые ${power.required} Вт.`
        : `${psu.name} (${psu.specs.wattage} Вт) слабее требуемых ${power.required} Вт.`,
    };
  }
}
