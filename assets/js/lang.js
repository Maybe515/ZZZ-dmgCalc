// lang.js
export function applyLanguage(dict) {
  const apply = (selector, prop) => {
    document.querySelectorAll(selector).forEach(el => {
      const key = el.getAttribute(selector.replace(/\[|\]/g, ""));
      if (dict[key] !== undefined) {
        el[prop] = dict[key];
      }
    });
  };

  apply("[data-i18n]", "textContent");
  apply("[data-i18n-title]", "title");
}
