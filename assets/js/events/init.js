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
import { createStrapLine, createStrapPhysics } from "../ui/strap-physics.js";

// Data / Config
import { i18nDict, selects, state } from "../data/state.js";
import { selectMapping, fields, toggleMapping } from "../data/form-config.js";
import { defaults, selectDefaults, toggleDefaults } from "../data/default.js";

// DOM
import { $, q } from "../ui/dom-helpers.js";
import { bindCustomSelectEvents } from "./bind-events.js";
import { getDocumentCenter, toWrapperCoords } from "../ui/updates/helpers.js";

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

  // イベント登録
  Object.values(selects).forEach(bindCustomSelectEvents);
}

/**
 * 物理ストラップを生成する
 */
export function initStrapPhysics() {
  const anchor = $("strapAnchor");
  const circle = $("strapCircle");

  if (!anchor || !circle) return;

  const grid = q(".grid.grid--enemy");
  const mount = q(".strap-mount", grid);
  if (!mount) return;

  const wrapper = anchor.parentElement;

  // mount → wrapper 内座標へ変換
  const mountCenter = getDocumentCenter(mount);
  const wrapperRect = wrapper.getBoundingClientRect();
  const wrapperDocX = wrapperRect.left + window.scrollX;
  const wrapperDocY = wrapperRect.top + window.scrollY;

  const anchorX = mountCenter.x - wrapperDocX;
  const anchorY = mountCenter.y - wrapperDocY;

  anchor.style.left = `${anchorX}px`;
  anchor.style.top = `${anchorY}px`;

  const line = createStrapLine(anchor, circle, wrapper);
  const strap = createStrapPhysics(circle, {
    anchorEl: anchor,
    length: 80,         // 線の長さ
    gravity: 0.003,
    damping: 0.992,
    initialAngle: 0.2,
    lineEl: line.el,
    onUpdate: ({ x, y, angle }) => {
      const local = toWrapperCoords(wrapper, x, y);     
      line.updateWithPoint(local.x, local.y);
    }
  });

  return { strap, wrapper, anchor, circle, line };
}

let strapState = null;

export function setupStrap() {
  if (strapState?.strap?.destroy) {
    strapState.strap.destroy();
  }
  strapState = initStrapPhysics();
  return strapState;
}

// ★ ResizeObserver（レイアウト変化を監視）
const grid = q(".grid.grid--enemy");
const ro = new ResizeObserver(() => {
  window.strapState = setupStrap();
});
ro.observe(grid);

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
