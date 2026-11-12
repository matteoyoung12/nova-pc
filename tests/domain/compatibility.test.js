import test from "node:test";
import assert from "node:assert/strict";
import {
  ComponentFactory,
  PcBuild,
  PowerEstimator,
  CpuSocketRule,
  MemoryTypeRule,
  PsuRule,
} from "../../src/shared/domain.js";
const factory = new ComponentFactory(),
  make = (category, id, specs, power = 0) =>
    factory.create({
      category,
      id,
      name: id,
      price_rub: 1,
      performance_score: 1,
      power_draw_watts: power,
      specs,
    });
test("сокет проверяется в позитивном и негативном случае", () => {
  const build = new PcBuild();
  build.add(make("cpu", "cpu", { socket: "AM5" }));
  build.add(
    make("motherboard", "board", {
      socket: "AM5",
      memoryType: "DDR5",
      formFactor: "ATX",
      memorySlots: 4,
    }),
  );
  assert.equal(new CpuSocketRule().check(build).status, "passed");
  build.add(
    make("motherboard", "bad", {
      socket: "LGA1700",
      memoryType: "DDR5",
      formFactor: "ATX",
      memorySlots: 4,
    }),
  );
  assert.equal(new CpuSocketRule().check(build).status, "failed");
});
test("тип памяти проверяется", () => {
  const build = new PcBuild();
  build.add(
    make("motherboard", "board", {
      socket: "AM5",
      memoryType: "DDR5",
      formFactor: "ATX",
      memorySlots: 4,
    }),
  );
  build.add(make("memory", "ram", { memoryType: "DDR4" }));
  assert.equal(new MemoryTypeRule().check(build).status, "failed");
});
test("граница запаса мощности 20 процентов", () => {
  const power = new PowerEstimator(),
    build = new PcBuild();
  build.add(make("cpu", "cpu", { socket: "AM5" }, 100));
  build.add(make("psu", "psu", { wattage: 200 }));
  assert.equal(power.estimate(build).required, 192);
  assert.equal(new PsuRule(power).check(build).status, "passed");
});
