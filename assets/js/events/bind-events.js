// UI のイベントバインドを担当するモジュール
// ---------------- Imports ----------------
// Calculate
import { compute } from "../calculate/compute-handler.js";

// Data loading
import { loadLanguage } from "../data/data-loader.js";

// UI updates
import { updateAgentInfo } from "../ui/updates/agent.js";
import { updateEnemyInfo } from "../ui/updates/enemy.js";
import { updateMatchSelect } from "../ui/updates/match.js";
import { updateLevelCorrect, updateLevelCoefficient, updateAnomalyCorr, updateWeakRange, updateAttrMatchPct, refreshSheerField, refreshAttackField } from "../ui/updates/derived.js";
import { updateVisibilityByMode } from "../ui/updates/mode.js";
import { updateBreakControls } from "../ui/updates/break.js";

// Popup
import { openPopup, closePopup } from "../ui/popup.js";

// Toast
import { showToast } from "../ui/toast.js";
import { getCopyResult } from "../ui/copy.js";

// Init helpers
import { resetAll } from "./init.js";

// Data
import { i18nDict, helpTexts, state, agents, selects } from "../data/state.js";
import { fields } from "../data/form-config.js";

// DOM helpers
import { $, al, qa, sa } from "../ui/dom-helpers.js";

// ---------------- Helper: bind change event ----------------
/**
 * セレクト系のイベントを統一的にバインドする
 * handler → compute の順で実行
 */
function bindChange(id, handler) {
  const el = $(id);
  if (!el) return;

  al("change", () => {
    handler();
    compute();
  }, el);
}

// ---------------- Main binding ----------------
export function bindEvents() {
  // 入力フィールド（input / change）
  ["input", "change"].forEach(type => {
    fields.forEach(id => al(type, compute, $(id)));
  });

  // ---------------- Custom Selects ----------------
  qa(".custom-select").forEach(root => {
    al("select:change", async e => {
      const { id, value } = e.detail;

      switch (id) {
        case "langSelect":
          sa("lang", value || "jp");
          state.lang = value;
          await loadLanguage();
          updateAgentInfo(i18nDict);
          updateEnemyInfo(i18nDict);
          break;

        case "agentSelect":
          state.agentId = value;
          updateAgentInfo(i18nDict);
          updateMatchSelect();
          refreshAttackField();
          refreshSheerField();

          // エージェントの属性を attrSelect に反映
          const attrId = agents[value] ? agents[value].attributeId : "";
          selects.attrSelect.setValue(attrId);
          break;

        case "enemySelect":
          state.enemyId = value;
          updateEnemyInfo(i18nDict);
          updateMatchSelect();
          break;

        case "attrSelect":
          state.attrId = value;
          updateAnomalyCorr();
          break;

        case "rangeSelect":
          state.range = value;
          updateWeakRange();
          break;

        case "matchSelect":
          state.match = value;
          updateAttrMatchPct();
          break;
      }

      await loadLanguage();
      compute();
    }, root);
  });

  // ---------------- Mode ----------------
  qa('input[name="calcMode"]').forEach(el =>
    al("change", () => {
      updateVisibilityByMode();
      compute();
    }, el)
  );

  // ---------------- Input ----------------
  bindChange("agentLevel", updateLevelCorrect);
  bindChange("agentLevel", updateLevelCoefficient);

  // ---------------- Toggle ----------------
  const breakToggle = $("breakToggle");
  al("change", () => {
    if (breakToggle.checked) miasmaToggle.checked = false;

    updateBreakControls();
    compute();
  }, breakToggle);

  const miasmaToggle = $("miasmaToggle");
  al("change", () => {
    if (miasmaToggle.checked) breakToggle.checked = false;

    updateBreakControls();
    compute();
  }, miasmaToggle);

  // ---------------- Button ----------------
  const resetBtn = $("resetBtn");
  al("click", e => {
    e.preventDefault();
    resetAll();
  }, resetBtn);

  // ---------------- Popup ----------------
  const popup = $("infoPopup");
  qa(".info-btn").forEach(btn => {
    al("click", () => {
      const key = btn.dataset.key;
      const info = helpTexts[key];
      if (!info) return;

      const popupText = $("popupText");
      popupText.innerHTML = info.text.join("<br>");
      openPopup(popup);
    }, btn);
  });

  qa("[data-close]").forEach(el => {
    al("click", () => closePopup(popup), el);
  }, popup);

  // ---------------- Toast ----------------
  al("click", async e => {
    const btn = e.target.closest(".copy-icon");
    if (!btn) return;

    const text = getCopyResult(btn);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast();
    } catch (err) {
      console.error("コピーに失敗:", err);
      showToast(); // エラー時も通知は出す
    }
  });
}
