import { Box, Menu, ShoppingBag, UserRound } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function SiteHeader({ onNavigate, cartCount, onCart }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b14]/80 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between px-5 py-4 lg:px-10">
        <button
          onClick={() => onNavigate("shop")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Box size={20} className="text-cyan-300" />
          NOVA<span className="text-cyan-300">PC</span>
        </button>
        <nav className="hidden min-w-[560px] justify-between border border-white/10 bg-black/20 p-1 font-mono text-[10px] tracking-wider text-slate-400 md:flex">
          <button
            onClick={() => onNavigate("shop")}
            className="flex-1 px-5 py-3 transition hover:bg-cyan-300 hover:text-slate-950"
          >
            ГЛАВНАЯ
          </button>
          <button
            onClick={() => onNavigate("catalog")}
            className="flex-1 border-l border-white/10 px-5 py-3 transition hover:bg-cyan-300 hover:text-slate-950"
          >
            КАТАЛОГ
          </button>
          <button
            onClick={() => onNavigate("builder")}
            className="flex-1 border-l border-white/10 px-5 py-3 transition hover:bg-cyan-300 hover:text-slate-950"
          >
            СБОРКА ПК
          </button>
          <button
            onClick={() => onNavigate("about")}
            className="flex-1 border-l border-white/10 px-5 py-3 transition hover:bg-cyan-300 hover:text-slate-950"
          >
            О НАС
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <select
            aria-label="Валюта"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="h-10 border border-white/10 bg-[#080b14] px-2 font-mono text-[10px] text-cyan-100 outline-none"
          >
            <option value="BYN">BYN</option>
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
          </select>
          <a
            href="/account"
            aria-label="Личный кабинет"
            title="Личный кабинет"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
          >
            <UserRound size={18} />
          </a>
          <button
            onClick={onCart}
            aria-label={`Открыть заявку: ${cartCount}`}
            className="grid h-10 min-w-10 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && <b className="ml-1 text-xs">{cartCount}</b>}
          </button>
          <Menu size={20} className="text-slate-400 md:hidden" />
        </div>
      </div>
    </header>
  );
}
