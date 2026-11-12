import {
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { order, parts } from "./Builder";
import { runtimeFormat, useCurrency } from "../context/CurrencyContext";

const clone = Object.fromEntries(
  Object.entries(parts).map(([key, value]) => [
    key,
    value.map((item) => ({ ...item })),
  ]),
);
const add = (key, sourceId, id, name, price, note) => {
  const source = clone[key].find((item) => item.id === sourceId);
  clone[key].push({ ...source, id, name, price, note, saveId: source.id });
};
const extra = {
  CPU: [
    ["cpu-7500f", "cpu-7600", "AMD Ryzen 5 7500F", 15990, "6 CORES / AM5"],
    ["cpu-7600x", "cpu-7600", "AMD Ryzen 5 7600X", 21990, "6 CORES / AM5"],
    ["cpu-7800x3d", "cpu-7700", "AMD Ryzen 7 7800X3D", 43990, "8 CORES / AM5"],
    ["cpu-9700x", "cpu-7700", "AMD Ryzen 7 9700X", 38990, "8 CORES / AM5"],
    [
      "cpu-14400f",
      "cpu-12400",
      "Intel Core i5-14400F",
      18990,
      "10 CORES / LGA1700",
    ],
    [
      "cpu-14500",
      "cpu-14600",
      "Intel Core i5-14500",
      22990,
      "14 CORES / LGA1700",
    ],
    [
      "cpu-14700f",
      "cpu-14600",
      "Intel Core i7-14700F",
      34990,
      "20 CORES / LGA1700",
    ],
    [
      "cpu-14700k",
      "cpu-14600",
      "Intel Core i7-14700K",
      41990,
      "20 CORES / LGA1700",
    ],
  ],
  GPU: [
    ["gpu-3060", "gpu-4060", "GeForce RTX 3060", 27990, "12 GB / DLSS"],
    ["gpu-4060ti", "gpu-4060", "GeForce RTX 4060 Ti", 43990, "8 GB / DLSS 3"],
    ["gpu-4070", "gpu-4070", "GeForce RTX 4070", 58990, "12 GB / DLSS 3"],
    ["gpu-4070ti", "gpu-4070", "GeForce RTX 4070 Ti", 79990, "12 GB / DLSS 3"],
    ["gpu-rx7600", "gpu-4060", "Radeon RX 7600", 31990, "8 GB / RDNA 3"],
    ["gpu-7700oc", "gpu-7700", "Radeon RX 7700 XT OC", 52990, "12 GB / RDNA 3"],
    ["gpu-7800oc", "gpu-7800", "Radeon RX 7800 XT OC", 62990, "16 GB / RDNA 3"],
    [
      "gpu-4080",
      "gpu-7800",
      "GeForce RTX 4080 SUPER",
      129990,
      "16 GB / DLSS 3",
    ],
  ],
  BOARD: [
    [
      "mb-b650e",
      "mb-b650",
      "ASUS ROG STRIX B650E-F",
      32990,
      "AM5 / DDR5 / ATX",
    ],
    ["mb-x670", "mb-b650", "MSI MAG X670E TOMAHAWK", 39990, "AM5 / DDR5 / ATX"],
    [
      "mb-b650i",
      "mb-b650m",
      "ASRock B650I Lightning",
      24990,
      "AM5 / DDR5 / mATX",
    ],
    ["mb-a620", "mb-b650m", "GIGABYTE A620M S2H", 9990, "AM5 / DDR5 / mATX"],
    [
      "mb-z790",
      "mb-b760m",
      "ASUS PRIME Z790-P",
      27990,
      "LGA1700 / DDR5 / mATX",
    ],
    [
      "mb-b760",
      "mb-b760m",
      "MSI MAG B760 TOMAHAWK",
      21990,
      "LGA1700 / DDR5 / mATX",
    ],
    [
      "mb-b660i",
      "mb-b660",
      "ASRock B660M Steel Legend",
      15990,
      "LGA1700 / DDR4 / mATX",
    ],
    ["mb-h610", "mb-b660", "GIGABYTE H610M H", 8990, "LGA1700 / DDR4 / mATX"],
  ],
  RAM: [
    [
      "ram-ddr5-24",
      "ram-ddr5-16",
      "Kingston Fury 24 GB",
      9490,
      "DDR5 / 6000 MT/s",
    ],
    [
      "ram-ddr5-48",
      "ram-ddr5-32",
      "Corsair Vengeance 48 GB",
      18490,
      "DDR5 / 6000 MT/s",
    ],
    [
      "ram-ddr5-64",
      "ram-ddr5-32",
      "G.Skill Trident Z5 64 GB",
      25990,
      "DDR5 / 6400 MT/s",
    ],
    [
      "ram-ddr5-96",
      "ram-ddr5-32",
      "Kingston Renegade 96 GB",
      39990,
      "DDR5 / 6400 MT/s",
    ],
    [
      "ram-ddr4-24",
      "ram-ddr4-16",
      "Kingston Fury 24 GB",
      6990,
      "DDR4 / 3600 MT/s",
    ],
    [
      "ram-ddr4-32k",
      "ram-ddr4-32",
      "Corsair Vengeance 32 GB",
      8990,
      "DDR4 / 3600 MT/s",
    ],
    [
      "ram-ddr4-64",
      "ram-ddr4-32",
      "G.Skill Ripjaws 64 GB",
      15990,
      "DDR4 / 3600 MT/s",
    ],
    [
      "ram-ddr4-128",
      "ram-ddr4-32",
      "Kingston Fury 128 GB",
      27990,
      "DDR4 / 3200 MT/s",
    ],
  ],
  STORAGE: [
    ["ssd-1t-980", "ssd-1tb", "Samsung 980 PRO 1 TB", 9990, "NVME / PCIE 4.0"],
    [
      "ssd-1t-sn850",
      "ssd-1tb",
      "WD Black SN850X 1 TB",
      10990,
      "NVME / PCIE 4.0",
    ],
    ["ssd-2t-990", "ssd-2tb", "Samsung 990 PRO 2 TB", 20990, "NVME / PCIE 4.0"],
    [
      "ssd-2t-sn850",
      "ssd-2tb",
      "WD Black SN850X 2 TB",
      18990,
      "NVME / PCIE 4.0",
    ],
    ["ssd-4t-990", "ssd-2tb", "Samsung 990 PRO 4 TB", 39990, "NVME / PCIE 4.0"],
    [
      "ssd-4t-crucial",
      "ssd-2tb",
      "Crucial T500 4 TB",
      34990,
      "NVME / PCIE 4.0",
    ],
    ["hdd-4tb", "hdd-2tb", "Seagate IronWolf 4 TB", 9990, "HDD / ARCHIVE"],
    ["hdd-8tb", "hdd-2tb", "WD Red Plus 8 TB", 19990, "HDD / ARCHIVE"],
  ],
  PSU: [
    ["psu-600", "psu-550", "Deepcool PK600D", 6990, "600W / 80 PLUS"],
    ["psu-700", "psu-650", "be quiet! Pure Power 12 M", 12990, "700W / GOLD"],
    ["psu-750x", "psu-750", "Deepcool PX750G", 14990, "750W / GOLD"],
    ["psu-850x", "psu-850", "Corsair RM850x", 18990, "850W / GOLD"],
    [
      "psu-1000",
      "psu-850",
      "be quiet! Straight Power 12",
      25990,
      "1000W / GOLD",
    ],
    ["psu-1000x", "psu-850", "Corsair RM1000x", 28990, "1000W / GOLD"],
    ["psu-1200", "psu-850", "Seasonic Vertex GX-1200", 34990, "1200W / GOLD"],
    ["psu-1600", "psu-850", "Corsair AX1600i", 49990, "1600W / TITANIUM"],
  ],
  CASE: [
    ["case-pop", "case-air", "Fractal Design Pop Air", 9490, "ATX / AIRFLOW"],
    ["case-4000d", "case-air", "Corsair 4000D Airflow", 11990, "ATX / AIRFLOW"],
    ["case-h6", "case-nzxt", "NZXT H6 Flow", 15990, "ATX / FLOW"],
    ["case-north", "case-nzxt", "Fractal Design North", 18990, "ATX / FLOW"],
    ["case-ap201", "case-q300", "ASUS Prime AP201", 9990, "mATX / MESH"],
    ["case-a3", "case-q300", "Lian Li A3-mATX", 11990, "mATX / MESH"],
    ["case-ch370", "case-q300", "Deepcool CH370", 6990, "mATX / AIRFLOW"],
    ["case-lancool", "case-air", "Lian Li LANCOOL 216", 13990, "ATX / AIRFLOW"],
  ],
  COOLER: [
    ["cooler-ak400", "cooler-ag400", "Deepcool AK400", 2990, "TOWER / 155 MM"],
    [
      "cooler-pa120",
      "cooler-ag400",
      "Thermalright PA120",
      4990,
      "DUAL TOWER / 157 MM",
    ],
    [
      "cooler-darkrock",
      "cooler-noctua",
      "be quiet! Dark Rock 5",
      7290,
      "SILENT / 161 MM",
    ],
    [
      "cooler-nh15",
      "cooler-ak620",
      "Noctua NH-D15",
      11990,
      "DUAL TOWER / 160 MM",
    ],
    ["cooler-ls520", "cooler-ag400", "Deepcool LS520 SE", 8990, "AIO / 240 MM"],
    [
      "cooler-ls720",
      "cooler-ak620",
      "Deepcool LS720 SE",
      11990,
      "AIO / 360 MM",
    ],
    ["cooler-kraken", "cooler-ak620", "NZXT Kraken 240", 15990, "AIO / 240 MM"],
    [
      "cooler-liquid",
      "cooler-ag400",
      "Arctic Liquid Freezer III",
      10990,
      "AIO / 240 MM",
    ],
  ],
};
Object.entries(extra).forEach(([key, list]) =>
  list.forEach(([id, source, name, price, note]) =>
    add(key, source, id, name, price, note),
  ),
);
[
  [
    "BOARD",
    "mb-b650m",
    [
      ["mb-b650-a", "ASUS PRIME B650M-A", 14990],
      ["mb-b650-b", "MSI B650 GAMING PLUS", 19990],
      ["mb-b650-c", "GIGABYTE B650 EAGLE AX", 18990],
      ["mb-b650-d", "ASRock B650M PG Riptide", 21990],
    ],
  ],
  [
    "BOARD",
    "mb-b760m",
    [
      ["mb-b760-a", "ASUS TUF B760M-PLUS", 18990],
      ["mb-b760-b", "MSI PRO B760-P WIFI", 17490],
      ["mb-b760-c", "GIGABYTE B760 GAMING X", 20990],
      ["mb-b760-d", "ASRock B760M PG Sonic", 23990],
    ],
  ],
  [
    "RAM",
    "ram-ddr5-32",
    [
      ["ram-ddr5-a", "TeamGroup T-Force 32 GB", 11990],
      ["ram-ddr5-b", "ADATA XPG Lancer 32 GB", 12990],
      ["ram-ddr5-c", "Patriot Viper Venom 48 GB", 17990],
      ["ram-ddr5-d", "Corsair Dominator 64 GB", 29990],
    ],
  ],
  [
    "RAM",
    "ram-ddr4-32",
    [
      ["ram-ddr4-a", "TeamGroup T-Force 32 GB", 7990],
      ["ram-ddr4-b", "ADATA XPG Spectrix 32 GB", 8990],
      ["ram-ddr4-c", "Patriot Viper Steel 64 GB", 14990],
      ["ram-ddr4-d", "Corsair Vengeance LPX 64 GB", 16990],
    ],
  ],
  [
    "COOLER",
    "cooler-ag400",
    [
      ["cooler-a", "ID-Cooling SE-224-XTS", 2490],
      ["cooler-b", "Thermalright Assassin X", 2990],
      ["cooler-c", "Cooler Master Hyper 212", 3990],
      ["cooler-d", "Jonsbo CR-1000 EVO", 3490],
    ],
  ],
].forEach(([key, source, list]) =>
  list.forEach(([suffix, name, price]) =>
    add(
      key,
      source,
      suffix,
      name,
      price,
      clone[key].find((item) => item.id === source).note,
    ),
  ),
);
const label = {
  CPU: "PROCESSOR",
  GPU: "GRAPHICS",
  BOARD: "MAINBOARD",
  RAM: "MEMORY",
  STORAGE: "STORAGE",
  PSU: "POWER UNIT",
  CASE: "CHASSIS",
  COOLER: "THERMAL",
};
const money = (value) => runtimeFormat(value);
const pick = (active, list) =>
  list.find((item) => item.id === active?.id) || list[0];
const watts = (state) =>
  Math.ceil(
    (60 +
      Object.values(state).reduce((sum, item) => sum + (item.power || 0), 0)) *
      1.2,
  );
function normalize(draft) {
  const board = pick(
    draft.BOARD,
    clone.BOARD.filter((item) => item.socket === draft.CPU.socket),
  );
  const ram = pick(
    draft.RAM,
    clone.RAM.filter((item) => item.memory === board.memory),
  );
  const pcCase = pick(
    draft.CASE,
    clone.CASE.filter(
      (item) =>
        item.factors.includes(board.factor) &&
        item.gpuLength >= draft.GPU.length,
    ),
  );
  const cooler = pick(
    draft.COOLER,
    clone.COOLER.filter((item) => item.height <= pcCase.coolerHeight),
  );
  const state = {
    ...draft,
    BOARD: board,
    RAM: ram,
    CASE: pcCase,
    COOLER: cooler,
  };
  const result = {
    ...state,
    PSU: pick(
      draft.PSU,
      clone.PSU.filter((item) => item.wattage >= watts(state)),
    ),
  };
  localStorage.setItem("novapc-builder", JSON.stringify(result));
  return result;
}
function allowed(state) {
  return {
    ...clone,
    BOARD: clone.BOARD.filter((item) => item.socket === state.CPU.socket),
    RAM: clone.RAM.filter((item) => item.memory === state.BOARD.memory),
    CASE: clone.CASE.filter(
      (item) =>
        item.factors.includes(state.BOARD.factor) &&
        item.gpuLength >= state.GPU.length,
    ),
    COOLER: clone.COOLER.filter(
      (item) => item.height <= state.CASE.coolerHeight,
    ),
    PSU: clone.PSU.filter((item) => item.wattage >= watts(state)),
  };
}
const initial = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("novapc-builder"));
    if (saved) return normalize(saved);
  } catch {}
  return normalize(
    Object.fromEntries(order.map((key) => [key, clone[key][0]])),
  );
})();

export function FuturisticBuilder({ onOrder, onSave }) {
  const [selected, setSelected] = useState(initial),
    [page, setPage] = useState({}),
    [saving, setSaving] = useState(false);
  const available = useMemo(() => allowed(selected), [selected]);
  const price = useMemo(
    () => Object.values(selected).reduce((sum, item) => sum + item.price, 0),
    [selected],
  );
  const required = watts(selected);
  const choose = (key, item) => {
    setSelected((current) => normalize({ ...current, [key]: item }));
    setPage((current) => ({
      ...current,
      [key]: Math.floor(
        available[key].findIndex((entry) => entry.id === item.id) / 4,
      ),
    }));
  };
  const slide = (key, delta) =>
    setPage((current) => ({
      ...current,
      [key]: Math.max(
        0,
        Math.min(
          Math.ceil(available[key].length / 4) - 1,
          (current[key] || 0) + delta,
        ),
      ),
    }));
  const save = async () => {
    setSaving(true);
    await onSave({
      name: "NOVA CUSTOM // 01",
      componentIds: order.map(
        (key) => selected[key].saveId || selected[key].id,
      ),
    });
    setSaving(false);
  };
  return (
    <main className="fui-grid min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
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
            <div className="border border-white/10 bg-black/20 px-4 py-3 font-mono text-[10px] tracking-wider text-cyan-200">
              {required}W // VERIFIED
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
            12–14 вариантов в каждом модуле. Листайте стрелками — совместимость
            фильтруется автоматически.
          </p>
        </header>
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="space-y-2">
            {order.map((key, index) => {
              const currentPage = Math.min(
                  page[key] || 0,
                  Math.ceil(available[key].length / 4) - 1,
                ),
                items = available[key].slice(
                  currentPage * 4,
                  currentPage * 4 + 4,
                ),
                max = Math.ceil(available[key].length / 4);
              return (
                <div
                  key={key}
                  className="grid border border-white/10 bg-[#070b17]/65 lg:grid-cols-[154px_1fr]"
                >
                  <div className="border-b border-white/10 px-4 py-4 lg:border-b-0 lg:border-r">
                    <span className="font-mono text-[10px] tracking-[.22em] text-cyan-300">
                      0{index + 1}
                    </span>
                    <h2 className="mt-2 text-sm font-bold tracking-[.08em]">
                      {label[key]}
                    </h2>
                    <div className="mt-4 flex gap-1">
                      <button
                        aria-label={`Предыдущие варианты ${label[key]}`}
                        onClick={() => slide(key, -1)}
                        disabled={!currentPage}
                        className="grid h-7 w-7 place-items-center border border-white/10 disabled:opacity-20"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <button
                        aria-label={`Следующие варианты ${label[key]}`}
                        onClick={() => slide(key, 1)}
                        disabled={currentPage === max - 1}
                        className="grid h-7 w-7 place-items-center border border-white/10 disabled:opacity-20"
                      >
                        <ChevronRight size={15} />
                      </button>
                      <span className="ml-1 self-center font-mono text-[9px] text-slate-600">
                        {currentPage + 1}/{max}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
                    {items.map((item) => {
                      const active = selected[key].id === item.id;
                      return (
                        <button
                          onClick={() => choose(key, item)}
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
              );
            })}
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
            <div className="mt-5 border-y border-white/10 py-4 font-mono text-xs text-cyan-100">
              <span className="flex items-center gap-2">
                <Zap size={15} className="text-amber-200" />
                {required}W REQUIRED / {selected.PSU.wattage}W INSTALLED
              </span>
            </div>
            <dl className="my-4">
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
            </div>
            <button
              onClick={() => onOrder({ name: "Кастомная сборка", price })}
              className="mt-4 flex w-full items-center justify-between bg-cyan-300 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-950"
            >
              <span>ADD TO REQUEST</span>
              <ShoppingBag size={17} />
            </button>
            <button
              disabled={saving}
              onClick={save}
              className="mt-2 flex w-full items-center justify-between border border-white/15 px-4 py-3.5 font-mono text-xs tracking-wider text-slate-200 disabled:opacity-50"
            >
              <span>{saving ? "SAVING..." : "SAVE TO PROFILE"}</span>
              <Heart size={16} />
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
