// UI 初期化とデフォルト適用を担当するモジュール
// ---------------- Imports ----------------
// Calculate
import { setElementValue, compute } from "../calculate/compute-handler.js";

// Update UI
import { updateAgentInfo } from "../ui/updates/agent.js";
import { updateEnemyInfo } from "../ui/updates/enemy.js";
import { updateAnomalyCorr, updateWeakRange, updateAttrMatchPct, updateLevelCorrect, updateLevelCoefficient, refreshSheerField, refreshAttackField } from "../ui/updates/derived.js";
import { updateVisibilityByMode } from "../ui/updates/mode.js";
import { updateBreakControls } from "../ui/updates/break.js";

// Generate UI
import { createCustomSelect } from "../ui/custom-select.js";
import { getLangOptions, getAgentOptions, getEnemyOptions, getAttrOptions, getRangeOptions, getMatchOptions } from "../ui/generate-options.js";

// Data / Config
import { i18nDict, selects, state } from "../data/state.js";
import { selectMapping, fields, toggleMapping } from "../data/form-config.js";
import { defaults, selectDefaults, toggleDefaults } from "../data/default.js";

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
  updateVisibilityByMode();
  updateAgentInfo(i18nDict);
  updateEnemyInfo(i18nDict);
  updateLevelCorrect();
  updateLevelCoefficient();
  updateAnomalyCorr();
  updateWeakRange();
  updateAttrMatchPct();
  updateBreakControls();
  refreshAttackField();
  refreshSheerField();
}

/**
 * Custom Select を生成し、アプリ内データストアに ID をセットする
 */
export function initCustomSelects() {
  selects.langSelect = createCustomSelect($("langSelect"), getLangOptions());
  selects.agentSelect = createCustomSelect($("agentSelect"), getAgentOptions());
  selects.enemySelect = createCustomSelect($("enemySelect"), getEnemyOptions());
  selects.attrSelect = createCustomSelect($("attrSelect"), getAttrOptions());
  selects.rangeSelect = createCustomSelect($("rangeSelect"), getRangeOptions());
  selects.matchSelect = createCustomSelect($("matchSelect"), getMatchOptions());
}

// ---------------- Reset All ----------------
/**
 * 全フィールドを selectDefaults にリセットし、UI を再構築する
 */
export function resetAll() {
  // --- Reset custom selects ---
  Object.entries(selectMapping).forEach(([key, map]) => {
    if (key === "lang") return; // 言語は維持

    const defaultValue = selectDefaults[key];
    if (defaultValue !== undefined) {
      selects[map.id]?.setValue(defaultValue);
      state[map.state] = defaultValue;
    }
  });

  // --- Reset toggles ---
  Object.entries(toggleMapping).forEach(([key, map]) => {
    const defaultValue = toggleDefaults[key];
    if (defaultValue !== undefined) {
      const el = $(map.id);
      if (el) {
        el.checked = defaultValue;
        state[map.state] = defaultValue;
      }
    }
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

  el.textContent = `${y}/${m}/${day}`;
}
