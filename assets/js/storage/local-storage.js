// UI 状態の保存・復元を担当するモジュール
import { $ } from "../ui/dom-helpers.js";
import { getCalcMode } from "../ui/mode.js";
import { getElementValue, setElementValue, collectValues } from "../calculate/compute-handler.js";
import { selectMapping, numericKeys, toggleMapping } from "../data/form-config.js";
import { selects, state } from "../data/state.js";

const STORAGE_KEY = "lastParams";

/**
 * UI から保存対象の値を収集する
 */
function collectBaseParams() {
  return {
    lang: state.lang,
    mode: getCalcMode(),
    agent: state.agentId,
    enemy: state.enemyId,
    attribute: state.attrId,
    range: state.range,
    attrMatch: state.match,
    breakToggle: $("breakToggle")?.checked,
    miasmaToggle: $("miasmaToggle")?.checked,
    ...collectValues()
  };
}

/**
 * selectMapping に従って値を params に追加
 */
function applySelectMapping(params) {
  Object.entries(selectMapping).forEach(([key, id]) => {
    const el = $(id);
    if (!el) return;
    params[key] = getElementValue(el);
  });
}

/**
 * LocalStorage に保存
 */
export function saveToLocalStorage() {
  const params = collectBaseParams();
  applySelectMapping(params);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}

/**
 * selectMapping に従って UI に値をセット
 */
function restoreSelectMapping(params) {
  Object.entries(selectMapping).forEach(([key, map]) => {
    const value = params[key];
    if (value !== undefined) {
      selects[map.id]?.setValue(value); // UI 更新
      state[map.state] = value;         // state 更新
    }
  });
}

/**
 * toggleMapping に従って UI に値をセット
 */
export function restoreToggleMapping(params) {
  Object.entries(toggleMapping).forEach(([key, map]) => {
    const value = params[key];
    if (value === undefined) return;

    const el = document.getElementById(map.id);
    if (!el) return;

    el.checked = value;
    state[map.state] = value;
  });
}

/**
 * 数値系の入力を復元
 */
function restoreNumericFields(params) {
  numericKeys.forEach(key => {
    if (params[key] !== undefined) {
      setElementValue($(key), params[key]);
    }
  });
}

/**
 * LocalStorage から復元
 */
export function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  let params;
  try {
    params = JSON.parse(saved);
  } catch {
    console.warn("保存データが壊れていたため、復元をスキップしました");
    return;
  }

  // モード復元
  if (params.mode === "mode--normal") {
    $("modeNormal").checked = true;
  } else {
    $("modeAnomaly").checked = true;
  }

  restoreNumericFields(params);
  restoreSelectMapping(params);
  restoreToggleMapping(params);

  // 言語切り替え（CSS 用）
  if (params.lang) {
    document.documentElement.setAttribute("lang", params.lang);
  }
}

/**
 * 保存データ削除
 */
export function clearSavedParams() {
  localStorage.removeItem(STORAGE_KEY);
  console.log("保存データを削除しました");
}
