// data-i18n 系属性を使用して UI テキストを更新する

/**
 * 指定された属性（例: data-i18n）を持つ要素に辞書を適用する
 * @param {string} attrName - 例: "data-i18n"
 * @param {string} prop - 更新するプロパティ（textContent, title など）
 * @param {object} dict - 翻訳辞書
 */
function applyAttribute(attrName, prop, dict) {
  const elements = document.querySelectorAll(`[${attrName}]`);

  elements.forEach(el => {
    const key = el.getAttribute(attrName);
    if (!key) return;

    const value = dict[key];
    if (value === undefined) return;

    el[prop] = value;
  });
}

/**
 * UI 全体に翻訳辞書を適用する
 * @param {object} dict - 翻訳辞書
 */
export function applyLanguage(dict) {
  applyAttribute("data-i18n", "textContent", dict);
  applyAttribute("data-i18n-title", "title", dict);
}
