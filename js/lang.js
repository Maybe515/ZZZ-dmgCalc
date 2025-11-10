// lang.js
export function applyLanguage(dict) {

  // 通常テキスト
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // ツールチップ (title属性)
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (dict[key] !== undefined) {
      el.title = dict[key];
    }
  });
}

