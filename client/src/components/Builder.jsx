import {
  ArrowUpRight,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

const part = (id, name, price, note, meta = {}) => ({
  id,
  name,
  price,
  note,
  ...meta,
});
export const parts = {
  CPU: [
    part("cpu-7600", "AMD Ryzen 5 7600", 18990, "6 CORES / AM5", {
      socket: "AM5",
      power: 65,
    }),
    part("cpu-7700", "AMD Ryzen 7 7700", 24990, "8 CORES / AM5", {
      socket: "AM5",
      power: 65,
    }),
    part("cpu-14600", "Intel Core i5-14600KF", 25990, "14 CORES / LGA1700", {
      socket: "LGA1700",
      power: 181,
    }),
    part("cpu-12400", "Intel Core i5-12400F", 12990, "6 CORES / LGA1700", {
      socket: "LGA1700",
      power: 117,
    }),
  ],
  GPU: [
    part("gpu-4060", "GeForce RTX 4060", 31990, "8 GB / DLSS 3", {
      power: 115,
      length: 242,
    }),
    part("gpu-4070", "GeForce RTX 4070 SUPER", 64990, "12 GB / DLSS 3", {
      power: 220,
      length: 300,
    }),
    part("gpu-7700", "Radeon RX 7700 XT", 48990, "12 GB / RDNA 3", {
      power: 245,
      length: 320,
    }),
    part("gpu-7800", "Radeon RX 7800 XT", 57990, "16 GB / RDNA 3", {
      power: 263,
      length: 335,
    }),
  ],
  BOARD: [
    part("mb-b650m", "MSI PRO B650M-A WIFI", 17490, "AM5 / DDR5 / mATX", {
      socket: "AM5",
      memory: "DDR5",
      factor: "mATX",
      power: 45,
    }),
    part("mb-b650", "ASUS TUF GAMING B650-PLUS", 21990, "AM5 / DDR5 / ATX", {
      socket: "AM5",
      memory: "DDR5",
      factor: "ATX",
      power: 50,
    }),
    part("mb-b760m", "GIGABYTE B760M DS3H", 13990, "LGA1700 / DDR5 / mATX", {
      socket: "LGA1700",
      memory: "DDR5",
      factor: "mATX",
      power: 42,
    }),
    part("mb-b660", "ASRock B660M Pro RS", 10990, "LGA1700 / DDR4 / mATX", {
      socket: "LGA1700",
      memory: "DDR4",
      factor: "mATX",
      power: 40,
    }),
  ],
  RAM: [
    part("ram-ddr5-16", "Kingston Fury 16 GB", 6990, "DDR5 / 5600 MT/s", {
      memory: "DDR5",
      power: 5,
    }),
    part("ram-ddr5-32", "Corsair Vengeance 32 GB", 12990, "DDR5 / 6000 MT/s", {
      memory: "DDR5",
      power: 7,
    }),
    part("ram-ddr4-16", "Kingston Fury 16 GB", 4590, "DDR4 / 3200 MT/s", {
      memory: "DDR4",
      power: 4,
    }),
    part("ram-ddr4-32", "G.Skill Ripjaws 32 GB", 8190, "DDR4 / 3600 MT/s", {
      memory: "DDR4",
      power: 6,
    }),
  ],
  STORAGE: [
    part("ssd-500", "Kingston NV2 500 GB", 3990, "NVME / SYSTEM", { power: 4 }),
    part("ssd-1tb", "WD Blue SN580 1 TB", 6490, "NVME / PCIE 4.0", {
      power: 5,
    }),
    part("ssd-2tb", "Samsung 990 EVO 2 TB", 15990, "NVME / PCIE 4.0", {
      power: 6,
    }),
    part("hdd-2tb", "Seagate BarraCuda 2 TB", 5990, "HDD / ARCHIVE", {
      power: 7,
    }),
  ],
  PSU: [
    part("psu-550", "be quiet! System Power 10", 6290, "550W / 80 PLUS", {
      wattage: 550,
    }),
    part("psu-650", "Deepcool PK650D", 7490, "650W / 80 PLUS", {
      wattage: 650,
    }),
    part("psu-750", "Corsair RM750e", 11990, "750W / GOLD", { wattage: 750 }),
    part("psu-850", "MSI MAG A850GL", 13990, "850W / GOLD", { wattage: 850 }),
  ],
  CASE: [
    part("case-mini", "Zalman i3 NEO", 4390, "mATX / COMPACT", {
      factors: ["mATX"],
      gpuLength: 300,
      coolerHeight: 155,
      power: 8,
    }),
    part("case-q300", "Cooler Master Q300L", 5290, "mATX / MESH", {
      factors: ["mATX"],
      gpuLength: 360,
      coolerHeight: 159,
      power: 8,
    }),
    part("case-air", "Deepcool CC560 ARGB", 5990, "ATX / AIRFLOW", {
      factors: ["ATX", "mATX"],
      gpuLength: 370,
      coolerHeight: 163,
      power: 10,
    }),
    part("case-nzxt", "NZXT H5 Flow", 9990, "ATX / FLOW", {
      factors: ["ATX", "mATX"],
      gpuLength: 365,
      coolerHeight: 165,
      power: 12,
    }),
  ],
  COOLER: [
    part("cooler-stock", "AMD Wraith Stealth", 0, "BASIC / 55 MM", {
      height: 55,
      power: 3,
    }),
    part("cooler-ag400", "Deepcool AG400", 2490, "TOWER / 150 MM", {
      height: 150,
      power: 4,
    }),
    part("cooler-noctua", "Noctua NH-U12S redux", 5390, "SILENT / 158 MM", {
      height: 158,
      power: 5,
    }),
    part("cooler-ak620", "Deepcool AK620", 6390, "DUAL TOWER / 160 MM", {
      height: 160,
      power: 5,
    }),
  ],
};
export const order = [
  "CPU",
  "GPU",
  "BOARD",
  "RAM",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLER",
];
const names = {
  CPU: "PROCESSOR",
  GPU: "GRAPHICS",
  BOARD: "MAINBOARD",
  RAM: "MEMORY",
  STORAGE: "STORAGE",
  PSU: "POWER UNIT",
  CASE: "CHASSIS",
  COOLER: "THERMAL",
};
const money = (number) => `${new Intl.NumberFormat("ru-RU").format(number)} ₽`;
const first = (current, list) =>
  list.find((item) => item.id === current?.id) || list[0];
const watts = (selected) =>
  Math.ceil(
    (60 +
      Object.values(selected).reduce(
        (sum, item) => sum + (item.power || 0),
        0,
      )) *
      1.2,
  );

function normalize(draft) {
  const board = first(
    draft.BOARD,
    parts.BOARD.filter((item) => item.socket === draft.CPU.socket),
  );
  const ram = first(
    draft.RAM,
    parts.RAM.filter((item) => item.memory === board.memory),
  );
  const pcCase = first(
    draft.CASE,
    parts.CASE.filter(
      (item) =>
        item.factors.includes(board.factor) &&
        item.gpuLength >= draft.GPU.length,
    ),
  );
  const cooler = first(
    draft.COOLER,
    parts.COOLER.filter((item) => item.height <= pcCase.coolerHeight),
  );
  const base = {
    ...draft,
    BOARD: board,
    RAM: ram,
    CASE: pcCase,
    COOLER: cooler,
  };
  return {
    ...base,
    PSU: first(
      draft.PSU,
      parts.PSU.filter((item) => item.wattage >= watts(base)),
    ),
  };
}

function availableFor(selected) {
  return {
    ...parts,
    BOARD: parts.BOARD.filter((item) => item.socket === selected.CPU.socket),
    RAM: parts.RAM.filter((item) => item.memory === selected.BOARD.memory),
    CASE: parts.CASE.filter(
      (item) =>
        item.factors.includes(selected.BOARD.factor) &&
        item.gpuLength >= selected.GPU.length,
    ),
    COOLER: parts.COOLER.filter(
      (item) => item.height <= selected.CASE.coolerHeight,
    ),
    PSU: parts.PSU.filter((item) => item.wattage >= watts(selected)),
  };
}

const initial = normalize(
  Object.fromEntries(order.map((key) => [key, parts[key][0]])),
);

export function Builder({ onOrder, onSave }) {
  const [selected, setSelected] = useState(initial);
  const [saving, setSaving] = useState(false);
  const options = useMemo(() => availableFor(selected), [selected]);
  const price = useMemo(
    () => Object.values(selected).reduce((sum, item) => sum + item.price, 0),
    [selected],
  );
  const required = useMemo(() => watts(selected), [selected]);
  const profile =
    selected.GPU.id === "gpu-4060"
      ? "FULL HD // HIGH"
      : selected.GPU.id === "gpu-4070"
        ? "2K // ULTRA"
        : "4K READY // ULTRA";
  const change = (key, item) =>
    setSelected((current) => normalize({ ...current, [key]: item }));
  const save = async () => {
    setSaving(true);
    await onSave({
      name: "NOVA CUSTOM // 01",
      componentIds: order.map((key) => selected[key].id),
    });
    setSaving(false);
  };

  return (
    <main className="fui-grid min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="border-b border-cyan-200/20 pb-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.34em] text-cyan-300">
                NOVA // CONFIGURATION LAB
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-[-.05em] sm:text-5xl">
                BUILD YOUR SIGNAL.
              </h1>
            </div>
            <div className="flex border border-white/10 bg-black/20 font-mono text-[10px] tracking-wider text-slate-400">
              <span className="border-r border-white/10 px-4 py-3">
                SYSTEM / ONLINE
              </span>
              <span className="px-4 py-3 text-cyan-200">{profile}</span>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
            Выбирайте железо — интерфейс сам убирает несовместимые варианты.
            Никаких красных ошибок и случайных конфигураций.
          </p>
        </header>
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="space-y-2">
            {order.map((key, index) => (
              <div
                key={key}
                className="group grid border border-white/10 bg-[#070b17]/65 transition hover:border-cyan-300/35 lg:grid-cols-[154px_1fr]"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:block lg:border-b-0 lg:border-r">
                  <span className="font-mono text-[10px] tracking-[.22em] text-cyan-300">
                    0{index + 1}
                  </span>
                  <h2 className="mt-0 text-sm font-bold tracking-[.08em] lg:mt-2">
                    {names[key]}
                  </h2>
                  <span className="hidden pt-2 font-mono text-[9px] text-slate-600 lg:block">
                    SELECT MODULE
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
                  {options[key].map((item) => {
                    const active = selected[key].id === item.id;
                    return (
                      <button
                        onClick={() => change(key, item)}
                        key={item.id}
                        className={`relative min-h-25 bg-[#070b17] px-4 py-4 text-left transition ${active ? "bg-cyan-300/[.09]" : "hover:bg-white/[.045]"}`}
                      >
                        <span
                          className={`absolute left-0 top-0 h-full w-px ${active ? "bg-cyan-300" : "bg-transparent"}`}
                        />
                        <span className="block pr-5 text-sm font-semibold leading-5">
                          {item.name}
                        </span>
                        <span className="mt-2 block font-mono text-[10px] tracking-wide text-slate-500">
                          {item.note}
                        </span>
                        <span
                          className={`mt-3 block font-mono text-xs ${active ? "text-cyan-200" : "text-slate-300"}`}
                        >
                          {item.price ? money(item.price) : "INCLUDED"}
                        </span>
                        {active && (
                          <Check
                            className="absolute right-3 top-3 text-cyan-300"
                            size={15}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
          <aside className="h-max border border-cyan-200/25 bg-[#090e1d]/90 p-5 shadow-[0_0_55px_rgba(34,211,238,.08)] backdrop-blur-xl xl:sticky xl:top-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[.28em] text-cyan-300">
                  LIVE ASSEMBLY
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold">
                  NOVA // 01
                </h2>
              </div>
              <Sparkles size={19} className="text-cyan-300" />
            </div>
            <div className="mt-5 border-y border-white/10 py-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>COMPATIBILITY</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Check size={13} /> VERIFIED
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono text-xs text-cyan-100">
                <Zap size={15} className="text-amber-200" />
                {required}W REQUIRED / {selected.PSU.wattage}W INSTALLED
              </div>
            </div>
            <dl className="my-4 space-y-0">
              {order.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[74px_1fr] gap-3 border-b border-white/5 py-2.5"
                >
                  <dt className="font-mono text-[9px] tracking-wider text-slate-600">
                    {key}
                  </dt>
                  <dd className="text-right text-xs leading-4 text-slate-200">
                    {selected[key].name}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="border border-white/10 bg-black/25 p-4">
              <p className="font-mono text-[9px] tracking-[.2em] text-slate-500">
                SYSTEM COST
              </p>
              <b className="mt-2 block font-display text-3xl tracking-tight">
                {money(price)}
              </b>
              <p className="mt-1 font-mono text-[9px] text-slate-600">
                FINAL CHECK BY NOVA ENGINEER
              </p>
            </div>
            <button
              onClick={() => onOrder({ name: "Кастомная сборка", price })}
              className="mt-4 flex w-full items-center justify-between bg-cyan-300 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-950 transition hover:bg-cyan-200"
            >
              <span>ADD TO REQUEST</span>
              <ArrowUpRight size={17} />
            </button>
            <button
              disabled={saving}
              onClick={save}
              className="mt-2 flex w-full items-center justify-between border border-white/15 px-4 py-3.5 font-mono text-xs tracking-wider text-slate-200 transition hover:border-violet-300/60 hover:bg-violet-400/10 disabled:opacity-50"
            >
              <span>{saving ? "SAVING..." : "SAVE TO PROFILE"}</span>
              <Heart size={16} />
            </button>
            <p className="mt-4 flex items-center gap-2 font-mono text-[9px] leading-4 text-slate-500">
              <Check size={13} className="shrink-0 text-cyan-300" />
              COMPATIBILITY ENGINE IS ACTIVE
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
