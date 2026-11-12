import { ApiClient } from "./api.js";
const api = new ApiClient(),
  root = document.querySelector("#builds"),
  dialog = document.querySelector("#dialog");
let pendingId = null;
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
const load = async () => {
  try {
    const data = await api.get("/api/builds");
    root.innerHTML = data.items.length
      ? data.items
          .map(
            (item) =>
              `<article class="saved-item"><div><strong>${escape(item.name)}</strong><p class="user-copy">Обновлено ${new Date(item.updated_at).toLocaleDateString("ru-RU")}</p></div><div class="build-actions"><button class="tiny" data-open="${item.id}">Открыть</button><button class="tiny" data-duplicate="${item.id}">Дублировать</button><button class="tiny" data-rename="${item.id}" data-name="${escape(item.name)}">Переименовать</button><button class="tiny" data-delete="${item.id}">Удалить</button></div></article>`,
          )
          .join("")
      : '<div class="empty"><svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#4F46E5" d="M13 19h38v26H13z"/></svg><strong>Сохранённых сборок пока нет</strong><br><a href="/">Соберите первый компьютер</a></div>';
  } catch (error) {
    root.innerHTML = `<div class="notice">${error.message}</div>`;
  }
};
root.addEventListener("click", async (event) => {
  const target = event.target,
    dataset = target.dataset,
    id = dataset.open ?? dataset.duplicate ?? dataset.rename ?? dataset.delete;
  if (!id) return;
  if (dataset.open) {
    location.href = `/?build=${encodeURIComponent(id)}`;
    return;
  }
  try {
    if (dataset.duplicate) {
      await api.post(`/api/builds/${id}/duplicate`, {});
      await load();
      return;
    }
    if (dataset.rename) {
      const name = prompt("Новое название сборки", dataset.name);
      if (!name) return;
      const build = await api.get(`/api/builds/${id}`);
      await api.put(`/api/builds/${id}`, {
        name,
        componentIds: build.item.items.map((item) => item.component_id),
      });
      await load();
      return;
    }
    pendingId = id;
    dialog.showModal();
  } catch (error) {
    alert(error.message);
  }
});
dialog.addEventListener("close", async () => {
  if (dialog.returnValue === "confirm" && pendingId) {
    try {
      await api.delete(`/api/builds/${pendingId}`);
      await load();
    } catch (error) {
      alert(error.message);
    }
  }
  pendingId = null;
});
load();
