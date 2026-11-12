import { ApiClient } from "./api.js";
import {
  ComponentFactory,
  PcBuild,
  PowerEstimator,
  createRules,
} from "/shared/domain.js";
const api = new ApiClient(),
  factory = new ComponentFactory(),
  estimator = new PowerEstimator(),
  labels = {
    cpu: "Процессор",
    gpu: "Видеокарта",
    motherboard: "Материнская плата",
    memory: "ОЗУ",
    storage: "Накопитель",
    psu: "Блок питания",
    case: "Корпус",
    cooler: "Кулер",
  },
  state = {
    catalog: [],
    build: new PcBuild(),
    query: { category: "", search: "", sort: "performance" },
  },
  $ = (selector) => document.querySelector(selector),
  catalog = $("#catalog"),
  slots = $("#slots"),
  rules = $("#rules"),
  toast = $("#toast");
const icon =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#4F46E5" d="M13 19h38v26H13z"/><path fill="#DB2777" d="M20 26h24v12H20z"/></svg>',
  money = (value) => `${value.toLocaleString("ru-RU")} ₽`,
  ids = () => state.build.all.map((item) => item.id),
  show = (message, isError = false) => {
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.hidden = false;
    clearTimeout(show.timeout);
    show.timeout = setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  };
const render = () => {
  const build = state.build,
    power = estimator.estimate(build),
    checked = createRules(estimator).map((rule) => rule.check(build)),
    price = build.all.reduce((sum, item) => sum + item.priceRub, 0),
    failed = checked.filter((item) => item.status === "failed").length,
    passed = checked.filter((item) => item.status === "passed").length;
  $("#price").textContent = money(price);
  $("#mobile-price").textContent = money(price);
  $("#watts").textContent = `${power.total.toLocaleString("ru-RU")} Вт`;
  $("#copy").disabled = !build.all.length;
  const status = build.all.length
    ? failed
      ? `Нарушено правил: ${failed}`
      : `Выполнено правил: ${passed}`
    : "Начните с процессора";
  $("#status").textContent = status;
  $("#mobile-status").textContent = status;
  const gauge = $("#gauge");
  gauge.dataset.status = power.status;
  if (power.headroom === null) {
    gauge.style.setProperty("--gauge-offset", "339.292");
    gauge.setAttribute("aria-label", "Добавьте блок питания");
    $("#gauge-value").textContent = "БП";
    $("#gauge-label").textContent = "не выбран";
    $("#power").textContent = "Добавьте блок питания для расчёта запаса.";
  } else {
    const percent = Math.max(0, Math.min(1, power.headroom / power.total));
    gauge.style.setProperty("--gauge-offset", String(339.292 * (1 - percent)));
    gauge.setAttribute("aria-label", `Запас мощности ${power.headroom} ватт`);
    $("#gauge-value").textContent =
      `${power.headroom >= 0 ? "+" : ""}${power.headroom}`;
    $("#gauge-label").textContent = "Вт запаса";
    $("#power").textContent = `Требуется ${power.required} Вт с запасом 20%.`;
  }
  slots.replaceChildren();
  Object.keys(labels).forEach((category) => {
    const selected = build.get(category),
      items = Array.isArray(selected) ? selected : selected ? [selected] : [],
      node = document.createElement("div");
    node.className = "slot";
    node.innerHTML = `<div class="slot-head"><span class="slot-title">${labels[category]}${["memory", "storage"].includes(category) ? ` · ${items.length}/${category === "memory" ? 4 : 3}` : ""}</span></div>${items.length ? "" : "<p>Не выбрано</p>"}`;
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "slot-item";
      row.innerHTML = `<strong>${item.name}</strong><button class="tiny" type="button" data-remove="${category}" data-id="${item.id}">Убрать</button>`;
      node.append(row);
    });
    slots.append(node);
  });
  rules.innerHTML = checked
    .map(
      (item) =>
        `<div class="rule" data-status="${item.status}"><strong>${item.status === "passed" ? "✓" : item.status === "failed" ? "×" : "•"}</strong><span><strong>${item.status === "passed" ? "Выполнено" : item.status === "failed" ? "Нарушено" : "Не проверено"}</strong><br>${item.message}</span>${item.category ? `<button class="tiny" type="button" data-goto="${item.category}">К категории</button>` : ""}</div>`,
    )
    .join("");
  catalog.innerHTML =
    state.catalog
      .map((item) => {
        const selected = ids().includes(item.id),
          multi = ["memory", "storage"].includes(item.category),
          full =
            multi &&
            build.get(item.category).length >=
              (item.category === "memory" ? 4 : 3),
          occupied = !multi && build.get(item.category),
          button = selected ? "Выбрано" : occupied ? "Заменить" : "Добавить";
        return `<article class="item"><div><span class="tag tag-${item.category}">${labels[item.category]}</span><strong class="item-name">${item.name}</strong><p class="item-meta"><span>${item.powerDrawWatts} Вт</span><span>Балл ${item.performance}</span></p><span class="price">${money(item.priceRub)}</span></div><button class="primary" type="button" data-add="${item.id}" ${selected || full ? "disabled" : ""} title="${full ? "Лимит категории достигнут" : ""}">${button}</button></article>`;
      })
      .join("") ||
    `<div class="empty">${icon}<strong>Ничего не найдено</strong><br>Попробуйте изменить поиск или фильтр.</div>`;
};
const load = async () => {
  catalog.innerHTML = '<div class="item">Загрузка каталога…</div>';
  try {
    const data = await api.get(
      `/api/catalog?${new URLSearchParams(state.query)}`,
    );
    state.catalog = data.items.map((item) => factory.create(item));
    $("#catalog-count").textContent = `${state.catalog.length} позиций`;
    render();
  } catch (error) {
    catalog.innerHTML = `<div class="empty">${icon}<strong>Каталог недоступен</strong><br><button class="secondary" id="retry" type="button">Повторить</button></div>`;
    $("#retry").onclick = load;
  }
};
Object.entries(labels).forEach(([id, label]) =>
  $("#category").insertAdjacentHTML(
    "beforeend",
    `<option value="${id}">${label}</option>`,
  ),
);
["search", "category", "sort"].forEach((id) =>
  $("#" + id).addEventListener(
    id === "search" ? "input" : "change",
    (event) => {
      state.query[id === "search" ? "search" : id] = event.target.value;
      load();
    },
  ),
);
catalog.addEventListener("click", (event) => {
  const id = event.target.dataset.add;
  if (!id) return;
  try {
    state.build.add(state.catalog.find((item) => item.id === id));
    render();
  } catch (error) {
    show(error.message, true);
  }
});
slots.addEventListener("click", (event) => {
  if (event.target.dataset.remove) {
    state.build.remove(event.target.dataset.remove, event.target.dataset.id);
    show("Компонент убран из сборки.");
    render();
  }
});
rules.addEventListener("click", (event) => {
  const category = event.target.dataset.goto;
  if (category) {
    $("#category").value = category;
    state.query.category = category;
    load();
    catalog.focus();
  }
});
$("#start-cpu").onclick = () => {
  state.query.category = "cpu";
  $("#category").value = "cpu";
  load();
  catalog.focus();
};
$("#save").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#save-error").textContent = "";
  try {
    await api.post("/api/builds", {
      name: new FormData(event.target).get("name"),
      componentIds: ids(),
    });
    event.target.reset();
    show("Сборка сохранена в вашем аккаунте.");
  } catch (error) {
    $("#save-error").textContent = error.message;
  }
});
$("#copy").onclick = async () => {
  const text = state.build.all
    .map(
      (item) =>
        `${labels[item.category]}: ${item.name} — ${money(item.priceRub)}`,
    )
    .join("\n");
  try {
    await navigator.clipboard.writeText(text);
    show("Спецификация скопирована.");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    show("Спецификация скопирована резервным способом.");
  }
};
$("#logout").onclick = async () => {
  await api.post("/api/auth/logout", {});
  location.href = "/login.html";
};
(async () => {
  const me = await api.get("/api/auth/me");
  if (!me.user) {
    location.href = "/login.html?return=/";
    return;
  }
  $("#user-name").textContent = `${me.user.display_name} · личный конфигуратор`;
  await load();
  const buildId = new URLSearchParams(location.search).get("build");
  if (buildId) {
    try {
      const saved = await api.get(`/api/builds/${buildId}`),
        all = await api.get("/api/catalog"),
        map = new Map(all.items.map((item) => [item.id, factory.create(item)]));
      saved.item.items.forEach((item) =>
        state.build.add(map.get(item.component_id)),
      );
      render();
      show(`Открыта сборка «${saved.item.name}».`);
    } catch (error) {
      show(error.message, true);
    }
  }
})();
