// UI 状態の保存・復元を担当するモジュール
import { $ } from "../ui/dom-helpers.js";
import { getCalcMode } from "../ui/mode.js";
import { getElementValue, setElementValue, collectValues } from "../calculate/compute-handler.js";
import { selectMapping, numericKeys } from "../data/form-config.js";

const STORAGE_KEY = "lastParams";

/**
 * UI から保存対象の値を収集する
 */
function collectBaseParams() {
  return {
    lang: $("langSelect")?.value,
    mode: getCalcMode(),
    agent: $("agentSelect")?.value,
    attribute: $("attrSelect")?.value,
    range: $("rangeSelect")?.value,
    enemy: $("enemySelect")?.value,
    attrMatch: $("matchSelect")?.value,
    breakToggle: $("breakToggle")?.checked,
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
  Object.entries(selectMapping).forEach(([key, id]) => {
    if (params[key] !== undefined) {
      setElementValue($(id), params[key]);
    }
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

  restoreSelectMapping(params);
  restoreNumericFields(params);
}

/**
 * 保存データ削除
 */
export function clearSavedParams() {
  localStorage.removeItem(STORAGE_KEY);
  console.log("保存データを削除しました");
}
