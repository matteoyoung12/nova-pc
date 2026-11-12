import {
  ArrowUpRight,
  Cpu,
  HardDrive,
  MemoryStick,
  MonitorCheck,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
const icons = [Cpu, MonitorCheck, MemoryStick, HardDrive];
const tabs = ["Standard", "Pro", "Ultra", "Extreme"];
export function Catalog({
  products,
  activeCategory,
  setActiveCategory,
  onOrder,
}) {
  const { formatPrice } = useCurrency();
  return (
    <section
      id="catalog"
      className="fui-grid border-b border-white/10 px-5 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] tracking-[.32em] text-cyan-300">
              SYSTEMS // PREBUILT
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">
              SELECT A PROFILE.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] leading-5 text-slate-500">
            Каждая серия — инженерный баланс производительности, температуры и
            цены.
          </p>
        </div>
        <div className="mt-8 flex overflow-x-auto border-y border-white/10 font-mono text-xs">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`min-w-32 border-r border-white/10 px-5 py-4 text-left transition ${activeCategory === tab ? "bg-cyan-300 text-slate-950" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="block text-[9px] opacity-60">0{index + 1}</span>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {products.map((product, productIndex) => (
            <article
              key={product.id}
              className="border border-white/10 bg-[#070b17]/75 p-5 transition hover:border-cyan-300/40"
            >
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-cyan-300">
                  SYSTEM // 0{productIndex + 1}
                </span>
                <span className="text-slate-500">
                  {product.badges.join(" / ")}
                </span>
              </div>
              <div className="mt-9 grid gap-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-display text-3xl font-bold">
                    {product.name}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                    {product.description}
                  </p>
                </div>
                <p className="font-display text-2xl">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="mt-7 grid border border-white/10 sm:grid-cols-2">
                {Object.entries(product.specifications).map(
                  ([key, value], index) => {
                    const Icon = icons[index];
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 border-b border-white/10 p-3"
                      >
                        <Icon size={15} className="text-cyan-300" />
                        <span className="font-mono text-[10px] text-slate-500">
                          {key.toUpperCase()}
                        </span>
                        <b className="ml-auto text-xs">{value}</b>
                      </div>
                    );
                  },
                )}
              </div>
              <button
                onClick={() => onOrder(product)}
                className="mt-5 flex w-full items-center justify-between border border-cyan-300/40 px-4 py-3 font-mono text-xs tracking-wider text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
              >
                ADD TO REQUEST <ArrowUpRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
