import { CATEGORY_LABELS } from "../infrastructure/catalog-data.js";
const money = new Intl.NumberFormat("ru-RU");
const plural = (number, one, few, many) => {
  const two = number % 100;
  const last = number % 10;
  return two > 10 && two < 20
    ? many
    : last === 1
      ? one
      : last > 1 && last < 5
        ? few
        : many;
};
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
export class CatalogView {
  #list;
  #count;
  #search;
  #category;
  #sort;
  constructor(root = document) {
    this.#list = root.querySelector("#catalog-list");
    this.#count = root.querySelector("#catalog-count");
    this.#search = root.querySelector("#catalog-search");
    this.#category = root.querySelector("#catalog-category");
    this.#sort = root.querySelector("#catalog-sort");
    this.#category.innerHTML = `<option value="all">Все категории</option>${Object.entries(
      CATEGORY_LABELS,
    )
      .map(([id, label]) => `<option value="${id}">${label}</option>`)
      .join("")}`;
  }
  get query() {
    return {
      search: this.#search.value,
      category: this.#category.value,
      sort: this.#sort.value,
    };
  }
  onChange(callback) {
    [this.#search, this.#category, this.#sort].forEach((input) =>
      input.addEventListener(input === this.#search ? "input" : "change", () =>
        callback(this.query),
      ),
    );
    this.#list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-component-id]");
      if (button) callback({ add: button.dataset.componentId });
    });
  }
  setCategory(category) {
    this.#category.value = category;
  }
  render(components, build) {
    this.#count.textContent = `${components.length} ${plural(components.length, "позиция", "позиции", "позиций")}`;
    this.#list.replaceChildren();
    if (!components.length) {
      this.#list.innerHTML =
        '<div class="empty-state">Ничего не найдено. Измените условия поиска.</div>';
      return;
    }
    components.forEach((component) => {
      const selected = build.allComponents.some(
        (item) => item.id === component.id,
      );
      const item = document.createElement("article");
      item.className = "catalog-item";
      item.innerHTML = `<div><p class="item-category">${CATEGORY_LABELS[component.category]}</p><p class="item-name">${component.name}</p><p class="item-meta">${component.powerDraw} Вт · балл ${component.performance}</p><p class="item-price">${money.format(component.price)} ₽</p></div><button class="add-button" type="button" data-component-id="${component.id}" ${selected ? "disabled" : ""}>${selected ? "Выбрано" : "Добавить"}</button>`;
      this.#list.append(item);
    });
  }
}
export class BuildSlotsView {
  #root;
  constructor(root = document) {
    this.#root = root.querySelector("#build-slots");
  }
  onAction(callback) {
    this.#root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-category]");
      if (button)
        callback(button.dataset.removeCategory, button.dataset.removeId);
    });
  }
  render(build) {
    this.#root.replaceChildren();
    build.entries.forEach(([category, value]) => {
      const entries = Array.isArray(value) ? value : value ? [value] : [];
      const item = document.createElement("div");
      item.className = "slot";
      item.innerHTML = `<div class="slot-head"><span class="slot-title">${CATEGORY_LABELS[category]}${["memory", "storage"].includes(category) ? ` · ${entries.length}/${category === "memory" ? 4 : 3}` : ""}</span></div>`;
      if (!entries.length) {
        item.innerHTML += '<p class="slot-empty">Не выбрано</p>';
      } else {
        entries.forEach((component) => {
          const row = document.createElement("div");
          row.className = "slot-component";
          row.innerHTML = `<p>${component.name}</p><button class="remove-button" type="button" data-remove-category="${category}" data-remove-id="${component.id}" aria-label="Убрать ${component.name}">Убрать</button>`;
          item.append(row);
        });
      }
      this.#root.append(item);
    });
  }
}
export class CompatibilityPanelView {
  #root;
  constructor(root = document) {
    this.#root = root.querySelector("#compatibility-list");
  }
  onNavigate(callback) {
    this.#root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (button) callback(button.dataset.category);
    });
  }
  render(results) {
    this.#root.replaceChildren();
    results.forEach((result) => {
      const state =
        result.passed === true
          ? "passed"
          : result.passed === false
            ? "failed"
            : "pending";
      const item = document.createElement("div");
      item.className = "compatibility-item";
      item.dataset.state = state;
      item.innerHTML = `<span class="compatibility-icon">${state === "passed" ? "✓" : state === "failed" ? "×" : "•"}</span><p>${result.message}</p>${state === "failed" ? `<button class="go-to-button" type="button" data-category="${result.category}">К категории</button>` : ""}`;
      this.#root.append(item);
    });
  }
}
export class PowerGaugeView {
  #gauge;
  #value;
  #caption;
  #count;
  #price;
  #power;
  #mobilePrice;
  #mobileStatus;
  constructor(root = document) {
    this.#gauge = root.querySelector("#power-gauge");
    this.#value = root.querySelector("#gauge-value");
    this.#caption = root.querySelector("#power-caption");
    this.#count = root.querySelector("#compatibility-count");
    this.#price = root.querySelector("#total-price");
    this.#power = root.querySelector("#total-power");
    this.#mobilePrice = root.querySelector("#mobile-price");
    this.#mobileStatus = root.querySelector("#mobile-status");
  }
  render(build, power, results) {
    const price = build.allComponents.reduce(
      (sum, item) => sum + item.price,
      0,
    );
    this.#price.textContent = `${money.format(price)} ₽`;
    this.#power.textContent = `${money.format(power.total)} Вт`;
    this.#mobilePrice.textContent = `${money.format(price)} ₽`;
    const failures = results.filter((item) => item.passed === false).length;
    const passed = results.filter((item) => item.passed === true).length;
    this.#count.textContent = `${passed} ${plural(passed, "правило", "правила", "правил")} выполнено · ${failures} ${plural(failures, "нарушение", "нарушения", "нарушений")}`;
    this.#mobileStatus.textContent = build.allComponents.length
      ? failures
        ? `${failures} ${plural(failures, "несовместимость", "несовместимости", "несовместимостей")}`
        : "Совместимо"
      : "Начните с процессора";
    if (power.headroom === null) {
      this.#gauge.style.setProperty("--gauge-offset", "339.292");
      this.#gauge.dataset.status = "accent";
      this.#value.textContent = "—";
      this.#caption.textContent = "Добавьте блок питания для расчёта запаса.";
      return;
    }
    const ratio = Math.max(-1, Math.min(1, power.ratio));
    this.#gauge.style.setProperty(
      "--gauge-offset",
      String(339.292 * (1 - Math.max(0, ratio))),
    );
    this.#gauge.dataset.status = power.status;
    this.#value.textContent = `${power.headroom >= 0 ? "+" : ""}${power.headroom} Вт`;
    this.#caption.textContent = `Нужно ${power.required} Вт с запасом 20%.`;
    this.#gauge.setAttribute(
      "aria-label",
      `Запас мощности: ${power.headroom} ватт`,
    );
  }
}
export class SavedBuildsView {
  #root;
  #form;
  #input;
  #error;
  constructor(root = document) {
    this.#root = root.querySelector("#saved-builds");
    this.#form = root.querySelector("#save-build-form");
    this.#input = root.querySelector("#build-name");
    this.#error = root.querySelector("#build-name-error");
  }
  onSave(callback) {
    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();
      callback(this.#input.value);
    });
  }
  onAction(callback) {
    this.#root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-saved-action]");
      if (button) callback(button.dataset.savedAction, button.dataset.savedId);
    });
  }
  clear() {
    this.#input.value = "";
    this.#error.textContent = "";
    this.#input.removeAttribute("aria-invalid");
  }
  error(message) {
    this.#error.textContent = message;
    this.#input.setAttribute("aria-invalid", "true");
  }
  render(saved) {
    this.#root.replaceChildren();
    if (!saved.length) {
      this.#root.innerHTML =
        '<div class="empty-state">Сохранённых сборок пока нет.</div>';
      return;
    }
    saved.forEach((build) => {
      const item = document.createElement("div");
      item.className = "saved-build";
      item.innerHTML = `<div><strong>${escapeHtml(build.name)}</strong><span>${new Date(build.createdAt).toLocaleDateString("ru-RU")}</span></div><div class="saved-actions"><button type="button" data-saved-action="open" data-saved-id="${build.id}">Открыть</button><button type="button" data-saved-action="duplicate" data-saved-id="${build.id}">Копия</button><button class="delete-saved" type="button" data-saved-action="delete" data-saved-id="${build.id}">Удалить</button></div>`;
      this.#root.append(item);
    });
  }
}
export class ToastView {
  #element;
  constructor(root = document) {
    this.#element = root.querySelector("#toast");
  }
  show(message) {
    this.#element.textContent = message;
    this.#element.hidden = false;
  }
  clear() {
    this.#element.hidden = true;
  }
}
export class ConfirmDialogView {
  #dialog;
  #pending;
  constructor(root = document) {
    this.#dialog = root.querySelector("#confirm-dialog");
  }
  ask(id, handler) {
    this.#pending = id;
    this.#dialog.showModal();
    this.#dialog.addEventListener(
      "close",
      () => {
        if (this.#dialog.returnValue === "confirm") handler(this.#pending);
        this.#pending = null;
      },
      { once: true },
    );
  }
}
