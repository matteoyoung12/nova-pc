import { Minus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";
export function OrderDrawer({ open, items, onClose, onRemove, onSubmit }) {
  const { formatPrice } = useCurrency();
  const [form, setForm] = useState({ name: "", phone: "" }),
    [done, setDone] = useState(false);
  if (!open) return null;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const submit = (event) => {
    event.preventDefault();
    if (!items.length) return;
    onSubmit({ ...form, items });
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-[70] bg-black/65">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-cyan-300/25 bg-[#08111f] p-6 shadow-[-20px_0_60px_rgba(0,0,0,.35)]">
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[.28em] text-cyan-300">
              NOVA // ORDER REQUEST
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              ВАША ЗАЯВКА
            </h2>
          </div>
          <button onClick={onClose} aria-label="Закрыть">
            <X />
          </button>
        </div>
        {done ? (
          <div className="grid flex-1 place-items-center text-center">
            <div>
              <ShoppingBag className="mx-auto text-cyan-300" size={32} />
              <h3 className="mt-5 font-display text-3xl">ЗАЯВКА ПРИНЯТА.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Мы свяжемся с вами по номеру {form.phone} для подтверждения
                комплектации и цены.
              </p>
              <button
                onClick={onClose}
                className="mt-7 border border-cyan-300/40 px-5 py-3 font-mono text-xs text-cyan-100"
              >
                ВЕРНУТЬСЯ В МАГАЗИН
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-5">
              {items.length ? (
                items.map((item, index) => (
                  <article
                    key={`${item.id || item.name}-${index}`}
                    className="flex items-start justify-between border-b border-white/10 py-4"
                  >
                    <div>
                      <p className="font-mono text-[10px] text-cyan-300">
                        СБОРКА // 0{index + 1}
                      </p>
                      <b className="mt-1 block">{item.name}</b>
                      <span className="mt-2 block text-sm text-slate-400">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemove(index)}
                      aria-label="Удалить сборку"
                      className="text-slate-500 hover:text-rose-300"
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="pt-12 text-center text-sm text-slate-500">
                  В заявке пока нет сборок.
                </div>
              )}
            </div>
            <div className="border-t border-white/10 pt-5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-500">ИТОГО</span>
                <b>{formatPrice(total)}</b>
              </div>
              <form onSubmit={submit} className="mt-5 space-y-3">
                <input
                  required
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                />
                <input
                  required
                  placeholder="Телефон +375"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                />
                <button
                  disabled={!items.length}
                  className="flex w-full items-center justify-between bg-cyan-300 px-4 py-3.5 font-mono text-xs font-bold text-slate-950 disabled:opacity-40"
                >
                  ОФОРМИТЬ ЗАЯВКУ <ShoppingBag size={16} />
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
