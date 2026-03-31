// UI 初期化とデフォルト適用を担当するモジュール

// ---------------- Imports ----------------
// 計算関連
import { setElementValue, compute } from "../calc/compute-handler.js";

// UI 更新
import { updateAgentInfo } from "../ui/updates/agent.js";
import { updateEnemyInfo } from "../ui/updates/enemy.js";
import { updateAnomalyCorr, updateWeakRange, updateAttrMatchPct, updateLevelCorrect, updateLevelCoefficient } from "../ui/updates/derived.js";
import { updateVisibilityByMode } from "../ui/updates/mode.js";
import { updateBreakControls } from "../ui/updates/break.js";

// i18n
import { getLabelValue } from "../i18n/i18n-helpers.js";

// Data / Config
import { i18nDict } from "../data/state.js";
import { selectMapping, fields } from "../data/form-config.js";
import { defaults, selectDefaults } from "../data/default.js";

// DOM
import { $ } from "../ui/dom-helpers.js";

// ---------------- Apply Defaults ----------------
/**
 * UI の各フィールドにデフォルト値を適用する
 * @param {boolean} force - true の場合は既存値を上書き
 */
export function applyDefaults(force = false) {
  // 入力フィールドにデフォルト値を適用
  fields.forEach(key => {
    const el = $(key);
    if (!el) return;

    const shouldApply = force || el.value === "" || el.value == null;
    if (shouldApply) {
      setElementValue(el, defaults[key]);
    }
  });

  // UI 更新
  updateAgentInfo(i18nDict);
  updateEnemyInfo(i18nDict);
  updateVisibilityByMode();
  updateLevelCorrect();
  updateLevelCoefficient();
  updateAnomalyCorr();
  updateWeakRange();
  updateAttrMatchPct();
  updateBreakControls();
}

// ---------------- Reset All ----------------
/**
 * 全フィールドを selectDefaults にリセットし、UI を再構築する
 */
export function resetAll() {
  Object.entries(selectMapping).forEach(([key, id]) => {
    if (key === "langSelect") return; // 言語は維持
    setElementValue($(id), selectDefaults[key]);
  });

  applyDefaults(true);
  compute();
}

// ---------------- Last Modified ----------------
/**
 * ページの最終更新日を表示する
 */
export function loadLastModified() {
  const el = $("lastModified");
  if (!el) return;

  const d = new Date(document.lastModified);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const label = getLabelValue({
    jp: "更新日: ",
    en: "Last Modified: "
  });

  el.textContent = `${label}${y}/${m}/${day}`;
}
