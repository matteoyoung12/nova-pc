import {
  ArrowUpRight,
  Copy,
  LogOut,
  Pencil,
  Save,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "novapc-order-draft";
const OPEN_ORDER_STORAGE_KEY = "novapc-open-order";
const EDIT_STORAGE_KEY = "novapc-builder-edit";
const date = new Intl.DateTimeFormat("ru-BY", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export function AccountPage() {
  const [state, setState] = useState({ loading: true, user: null, builds: [] }),
    [selected, setSelected] = useState(null),
    [name, setName] = useState(""),
    [notice, setNotice] = useState("");
  const refresh = async () => {
    const [a, b] = await Promise.all([
      fetch("/api/auth/me"),
      fetch("/api/builds"),
    ]);
    const auth = await a.json();
    setState({
      loading: false,
      user: auth.user,
      builds: b.ok ? (await b.json()).items : [],
    });
  };
  useEffect(() => {
    refresh().catch(() => setState({ loading: false, user: null, builds: [] }));
  }, []);
  const open = async (build) => {
    const response = await fetch(`/api/builds/${build.id}`);
    if (response.ok) {
      const item = (await response.json()).item;
      setSelected(item);
      setName(item.name);
    }
  };
  const action = async (type) => {
    if (!selected) return;
    let response;
    if (type === "save")
      response = await fetch(`/api/builds/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          componentIds: selected.items.map((item) => item.component_id),
          totalPrice: selected.total_rub,
        }),
      });
    if (type === "copy")
      response = await fetch(`/api/builds/${selected.id}/duplicate`, {
        method: "POST",
      });
    if (type === "delete")
      response = await fetch(`/api/builds/${selected.id}`, {
        method: "DELETE",
      });
    if (response?.ok) {
      setNotice(
        type === "save"
          ? "Сборка переименована"
          : type === "copy"
            ? "Копия сборки создана"
            : "Сборка удалена",
      );
      setSelected(null);
      refresh();
      setTimeout(() => setNotice(""), 3000);
    }
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.assign("/");
  };
  const orderSelectedBuild = () => {
    if (!selected) return;
    const componentPrice = selected.items.reduce(
      (sum, item) => sum + (item.price_rub || 0),
      0,
    );
    const price = selected.total_rub > 0 ? selected.total_rub : componentPrice;
    let safeCart = [];
    try {
      const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
      safeCart = Array.isArray(cart) ? cart : [];
    } catch {
      safeCart = [];
    }
    safeCart.push({
      id: `saved-build-${selected.id}`,
      name: selected.name,
      price,
      description: `Сохранённая сборка: ${selected.items.map((item) => item.name).join(", ")}`,
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safeCart));
    localStorage.setItem(OPEN_ORDER_STORAGE_KEY, "true");
    location.assign("/");
  };
  const editSelectedBuild = () => {
    if (!selected) return;
    localStorage.setItem(
      EDIT_STORAGE_KEY,
      JSON.stringify({
        id: selected.id,
        name,
        componentIds: selected.items.map((item) => item.component_id),
      }),
    );
    location.assign("/builder");
  };
  if (state.loading)
    return (
      <main className="fui-grid grid min-h-screen place-items-center font-mono text-xs text-cyan-200">
        ЗАГРУЖАЕМ ПРОФИЛЬ…
      </main>
    );
  if (!state.user)
    return (
      <main className="fui-grid grid min-h-screen place-items-center px-5 text-white">
        <section className="w-full max-w-md border border-cyan-300/20 bg-[#080d19]/85 p-8 text-center">
          <UserRound className="mx-auto text-cyan-300" />
          <p className="mt-6 font-mono text-[10px] tracking-[.28em] text-cyan-300">
            NOVA // IDENTITY
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold">
            ПРОФИЛЬ ЗАКРЫТ.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Войдите, чтобы сохранять конфигурации и управлять своими сборками.
          </p>
          <a
            href="/login"
            className="mt-7 flex items-center justify-between bg-cyan-300 px-4 py-3 font-mono text-xs font-bold text-slate-950"
          >
            ВОЙТИ <ArrowUpRight size={17} />
          </a>
        </section>
      </main>
    );
  return (
    <main className="fui-grid min-h-screen px-5 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <a
          href="/"
          className="font-mono text-[10px] tracking-wider text-slate-500"
        >
          ← В МАГАЗИН
        </a>
        <header className="mt-6 flex flex-wrap items-start justify-between gap-5 border border-cyan-300/20 bg-[#080d19]/80 p-6">
          <div>
            <p className="font-mono text-[10px] tracking-[.3em] text-cyan-300">
              NOVA // USER PROFILE
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold">
              {state.user.display_name.toUpperCase()}.
            </h1>
            <p className="mt-2 font-mono text-xs text-slate-500">
              {state.user.email} // BELARUS
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 border border-white/10 px-4 py-3 font-mono text-xs text-slate-300"
          >
            <LogOut size={16} />
            ВЫЙТИ
          </button>
        </header>
        <section className="mt-4 border border-white/10 bg-[#070b17]/75">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="font-mono text-[10px] text-cyan-300">
                CONFIGURATION ARCHIVE
              </p>
              <h2 className="mt-2 font-display text-2xl">ВАШИ СБОРКИ</h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {state.builds.length} TOTAL
            </span>
          </div>
          {state.builds.length ? (
            state.builds.map((build, index) => (
              <button
                onClick={() => open(build)}
                key={build.id}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 p-5 text-left transition hover:bg-cyan-300/[.06]"
              >
                <span className="font-mono text-xs text-cyan-300">
                  0{index + 1}
                </span>
                <span>
                  <b className="block">{build.name}</b>
                  <small className="mt-1 block text-slate-500">
                    Обновлено {date.format(new Date(build.updated_at))}
                  </small>
                </span>
                <ArrowUpRight className="text-cyan-300" size={18} />
              </button>
            ))
          ) : (
            <div className="p-8">
              <p className="font-display text-2xl">АРХИВ ПУСТ.</p>
              <a
                href="/builder"
                className="mt-5 inline-flex items-center gap-3 border border-cyan-300/40 px-4 py-3 font-mono text-xs text-cyan-100"
              >
                ОТКРЫТЬ СБОРКУ <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </section>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5">
          <section className="w-full max-w-xl border border-cyan-300/30 bg-[#08111f] p-6 shadow-[0_0_55px_rgba(34,211,238,.16)]">
            <div className="flex justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[.25em] text-cyan-300">
                  BUILD CONTROL
                </p>
                <h2 className="mt-2 font-display text-2xl">РЕДАКТОР СБОРКИ</h2>
              </div>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>
            <label className="mt-7 block font-mono text-[10px] text-slate-500">
              НАЗВАНИЕ СБОРКИ
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full border border-white/10 bg-black/25 px-4 py-3 font-sans text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>
            <div className="mt-5 border border-white/10 p-4">
              <p className="font-mono text-[10px] text-slate-500">
                КОМПОНЕНТОВ В СБОРКЕ: {selected.items.length}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Открыть конфигуратор можно после сохранения названия;
                сохранённые комплектующие остаются привязаны к этой сборке.
              </p>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <button
                onClick={() => action("save")}
                className="flex items-center justify-center gap-2 bg-cyan-300 px-3 py-3 font-mono text-xs font-bold text-slate-950"
              >
                <Save size={15} />
                СОХРАНИТЬ
              </button>
              <button
                onClick={() => action("copy")}
                className="flex items-center justify-center gap-2 border border-white/15 px-3 py-3 font-mono text-xs"
              >
                <Copy size={15} />
                КОПИРОВАТЬ
              </button>
              <button
                onClick={() => action("delete")}
                className="flex items-center justify-center gap-2 border border-rose-300/30 px-3 py-3 font-mono text-xs text-rose-200"
              >
                <Trash2 size={15} />
                УДАЛИТЬ
              </button>
            </div>
            <button
              onClick={orderSelectedBuild}
              className="mt-4 flex w-full items-center justify-between bg-cyan-300 px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-950"
            >
              ЗАКАЗАТЬ ЭТУ СБОРКУ
              <ShoppingBag size={16} />
            </button>
            <button
              onClick={editSelectedBuild}
              className="mt-4 flex items-center justify-center gap-2 border border-violet-300/35 py-3 font-mono text-xs text-violet-200"
            >
              <Pencil size={15} />
              ИЗМЕНИТЬ В КОНФИГУРАТОРЕ
            </button>
          </section>
        </div>
      )}
      {notice && (
        <div className="fixed bottom-6 right-6 border border-cyan-300/40 bg-[#08111f] px-5 py-4 font-mono text-xs text-cyan-100">
          ● {notice}
        </div>
      )}
    </main>
  );
}
