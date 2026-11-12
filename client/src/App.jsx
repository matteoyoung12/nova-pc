import { useEffect, useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { AccountPage } from "./components/AccountPage";
import { AuthPage } from "./components/AuthPage";
import { CurrencyBuilder } from "./components/CurrencyBuilder";
import { Catalog } from "./components/Catalog";
import { HeroSection } from "./components/HeroSection";
import { OrderDrawer } from "./components/OrderDrawer";
import { SiteHeader } from "./components/SiteHeader";
import { useProducts } from "./hooks/useProducts";

const CART_STORAGE_KEY = "novapc-order-draft";

function readSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Footer() {
  return (
    <footer id="service" className="border-t border-white/10 bg-[#060a14]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-12 font-mono text-xs text-slate-500 md:grid-cols-4 lg:px-10">
        <div>
          <b className="font-display text-lg text-white">NOVAPC</b>
          <p className="mt-3 max-w-xs leading-5">
            Кастомные игровые компьютеры и поддержка в Беларуси.
          </p>
        </div>
        <div>
          <b className="text-cyan-200">SERVICE / BY</b>
          <p className="mt-3 leading-6">
            12 мес. гарантии
            <br />
            Стресс-тест перед выдачей
            <br />
            Доставка по Беларуси
          </p>
        </div>
        <div>
          <b className="text-cyan-200">DIRECT LINE</b>
          <p className="mt-3 leading-6">
            <a
              href="tel:+375290000000"
              className="text-slate-300 hover:text-cyan-200"
            >
              +375 29 000-00-00
            </a>
            <br />
            <a
              href="mailto:hello@novapc.by"
              className="text-slate-300 hover:text-cyan-200"
            >
              hello@novapc.by
            </a>
            <br />
            Минск, Беларусь
          </p>
        </div>
        <div>
          <b className="text-cyan-200">PROFILE</b>
          <a
            href="/account"
            className="mt-3 block text-cyan-300 transition hover:text-cyan-100"
          >
            Личный кабинет →
          </a>
        </div>
      </div>
    </footer>
  );
}

function Storefront() {
  const { products, allProducts, activeCategory, setActiveCategory } =
    useProducts();
  const [page, setPage] = useState(
    ["/builder", "/configurator"].includes(location.pathname)
      ? "builder"
      : location.pathname === "/catalog"
        ? "catalog"
        : "shop",
  );
  const [cart, setCart] = useState(readSavedCart);
  const [toast, setToast] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  function navigate(target) {
    if (target === "builder") {
      setPage("builder");
      history.pushState({}, "", "/builder");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (target === "catalog") {
      setPage("catalog");
      history.pushState({}, "", "/catalog");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setPage("shop");
    history.pushState({}, "", "/");
    window.requestAnimationFrame(() => {
      const section =
        target === "catalog"
          ? document.querySelector("#catalog")
          : target === "about"
            ? document.querySelector("#about")
            : target === "service"
              ? document.querySelector("#service")
              : null;
      if (section) section.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function order(item) {
    setCart((list) => [...list, item]);
    setToast(`${item.name} добавлен в заявку`);
    window.setTimeout(() => setToast(""), 3500);
  }

  async function saveBuild(build) {
    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(build),
      });
      if (response.status === 401) {
        window.location.assign("/login");
        return;
      }
      const payload = await response.json();
      if (!response.ok)
        throw new Error(
          payload.error?.message || "Не удалось сохранить сборку.",
        );
      setToast("Сборка сохранена в личном кабинете");
    } catch (error) {
      setToast(error.message);
    }
    window.setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <SiteHeader
        onNavigate={navigate}
        cartCount={cart.length}
        onCart={() => setOrderOpen(true)}
      />
      {page === "shop" ? (
        <main>
          <HeroSection
            onBuild={() => navigate("builder")}
            onCatalog={() => navigate("catalog")}
          />
          <Catalog
            products={products.slice(0, 2)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOrder={order}
            onOpenCatalog={() => navigate("catalog")}
          />
          <AboutSection />
          <section className="fui-grid border-b border-white/10 px-5 py-20 lg:px-10">
            <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-6 border border-cyan-300/20 bg-[#080d19]/80 p-7">
              <div>
                <p className="font-mono text-[10px] tracking-[.3em] text-cyan-300">
                  NOVA // CUSTOM LAB
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold">
                  СОБЕРИТЕ ПК БЕЗ КОМПРОМИССОВ.
                </h2>
              </div>
              <button
                onClick={() => navigate("builder")}
                className="bg-cyan-300 px-5 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-950"
              >
                ОТКРЫТЬ КОНФИГУРАТОР →
              </button>
            </div>
          </section>
        </main>
      ) : page === "catalog" ? (
        <Catalog
          standalone
          products={allProducts.filter(
            (product) => product.category === activeCategory,
          )}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onOrder={order}
          onHome={() => navigate("shop")}
        />
      ) : (
        <CurrencyBuilder onOrder={order} onSave={saveBuild} />
      )}
      <Footer />
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 border border-cyan-300/40 bg-[#08111f]/95 px-5 py-4 font-mono text-xs tracking-wide text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,.18)]"
        >
          <span className="mr-3 text-cyan-300">●</span>
          {toast}
        </div>
      )}
      <OrderDrawer
        open={orderOpen}
        items={cart}
        onClose={() => setOrderOpen(false)}
        onRemove={(index) =>
          setCart((items) =>
            items.filter((_, itemIndex) => itemIndex !== index),
          )
        }
        onSubmit={() => {
          setCart([]);
          setToast("Заявка успешно оформлена");
        }}
      />
    </div>
  );
}

export default function App() {
  if (location.pathname === "/login") return <AuthPage mode="login" />;
  if (location.pathname === "/register") return <AuthPage mode="register" />;
  if (location.pathname === "/account") return <AccountPage />;
  return <Storefront />;
}
