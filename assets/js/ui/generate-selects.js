// Select 要素を自動生成する

import { $ } from "./dom-helpers.js";
import { attributes, rangeTable, matchTable } from "../data/state.js";

// i18n helper
import { t } from "../i18n/i18n-helpers.js";


/**
 * セレクトの prefix を決定する
*/
function getPrefix(id) {
    if (id === "agentSelect") return "agent";
    if (id === "enemySelect") return "enemy";
    return id; // fallback
}

/**
 * セレクト要素に options を生成する
*/
export function populateSelect(id, data, dict = {}) {
    const select = $(id);
    if (!select) return;
    
    const currentValue = select.value;
    const prefix = getPrefix(id);
    
    const label = t(dict, "ui.selectPrompt", "-- Select --");
    
    select.innerHTML = [
        `<option value="">${label}</option>`,
        ...Object.keys(data).map(key => {
            const text = t(dict, `${prefix}.${key}`, key);
            return `<option value="${key}">${text}</option>`;
        })
    ].join("");
    
    // 元の選択値が有効なら復元
    if (currentValue && data[currentValue]) {
        select.value = currentValue;
    }
}

/**
 * 汎用 option 生成
 */
function createOption(value, i18nKey) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.setAttribute("data-i18n", i18nKey);
  return opt;
}

/**
 * 属性セレクト(attrSelect)を生成
 * attributes.json を元に生成する
*/
export function generateAttrSelect() {
  const select = $("attrSelect");
  if (!select) return;

  select.innerHTML = "";

  // 先頭の「-- 選択してください --」
  select.appendChild(createOption("", "ui.selectPrompt"));

  // attributes.json のキーを列挙
  Object.entries(attributes).forEach(([id, meta]) => {
    select.appendChild(createOption(id, meta.label));
  });
}

/**
 * rangeSelect を生成
 */
export function generateRangeSelect() {
  const select = $("rangeSelect");
  if (!select) return;

  select.innerHTML = "";

  Object.keys(rangeTable).forEach(key => {
    select.appendChild(createOption(key, key));
  });
}

/**
 * matchSelect を生成
 */
export function generateMatchSelect() {
  const select = $("matchSelect");
  if (!select) return;

  select.innerHTML = "";

  Object.entries(matchTable).forEach(([key, meta]) => {
    select.appendChild(createOption(key, meta.label));
  });
}
