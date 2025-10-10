// ui.js
export const $ = (id) => document.getElementById(id);
export const q = (sel, root = document) => root.querySelector(sel);
export const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const setEl = (id, prop, value) => {
    const el = $(id);
    if (el) el[prop] = value;
};
export const setText = (id, value) => setEl(id, "textContent", value);
export const setValue = (id, value) => setEl(id, "value", value);

export function showToast() {
    const toast = $("toast");
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
}

export function bindCopyButtons() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-icon");
    if (!btn) return;

    const card = btn.closest(".result__card");
    const valueEl = card?.querySelector(".result__value");
    if (!valueEl) return;

    const text = valueEl.textContent?.trim();
    if (!text || text === "-") return;

    try {
      await navigator.clipboard.writeText(text);
      showToast();
    } catch (err) {
      console.error("コピーに失敗しました:", err);
      showToast();
    }
  });
}
