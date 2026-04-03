// Custom Select の Option を取得するモジュール
import { agents, enemies, attributes, rangeTable, matchTable, languages } from "../data/state.js";

/**
 * 汎用 Option データ
 * Custom Select の先頭行に挿入する
 */
const emptyOption = [
  { value: "", i18n: "ui.selectPrompt" }
];

/**
 * エージェントの Option データ
 */
export function getAgentOptions() {
  return [
    ...emptyOption,
    ...Object.keys(agents).map(id => ({
      value: id,
      i18n: `agent.${id}`
    }))
  ];
}

/**
 * エネミーの Option データ
 */
export function getEnemyOptions() {
  return [
    ...emptyOption,
    ...Object.keys(enemies).map(id => ({
      value: id,
      i18n: `enemy.${id}`
    }))
  ];
}

/**
 * 属性の Option データ
 */
export function getAttrOptions() {
  return [
    ...emptyOption,
    ...Object.keys(attributes).map(id => ({
      value: id,
      i18n: attributes[id].label
    }))
  ];
}

/**
 * 距離減衰補正の Option データ
 */
export function getRangeOptions() {
  return Object.keys(rangeTable).map(key => ({
    value: key,
    i18n: key
  }));
}

/**
 * 属性相性補正の Option データ
 */
export function getMatchOptions() {
  return Object.keys(matchTable).map(key => ({
    value: key,
    i18n: matchTable[key].label
  }));
}

/**
 * 言語の Option データ
 */
export function getLangOptions() {
  return Object.keys(languages).map(code => ({
    value: code,
    label: languages[code].label,
    i18n: `lang.${code}`
  }));
}
