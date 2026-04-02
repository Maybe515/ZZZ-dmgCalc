// <Select> 要素を自動生成するモジュール
import { $ } from "./dom-helpers.js";
import { agents, enemies, attributes, rangeTable, matchTable } from "../data/state.js";

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
 * エージェントセレクト(agentSelect)を生成
 * agents.json を元に生成する
*/
export function generateAgentSelect() {
  const select = $("agentSelect");
  if (!select) return;

  select.innerHTML = "";

  select.appendChild(createOption("", "ui.selectPrompt"));

  Object.entries(agents).forEach(([id, meta]) => {
    select.appendChild(createOption(id, `agent.${id}`));
  });
}

/**
 * エネミーセレクト(enemySelect)を生成
 * enemies.json を元に生成する
*/
export function generateEnemySelect() {
  const select = $("enemySelect");
  if (!select) return;

  select.innerHTML = "";

  select.appendChild(createOption("", "ui.selectPrompt"));

  Object.entries(enemies).forEach(([id, meta]) => {
    select.appendChild(createOption(id, `enemy.${id}`));
  });
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
