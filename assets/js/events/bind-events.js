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
import { updateLevelCorrect, updateLevelCoefficient, updateAnomalyCorr, updateWeakRange, updateAttrMatchPct } from "../ui/updates/derived.js";
import { updateVisibilityByMode } from "../ui/updates/mode.js";
import { updateBreakControls } from "../ui/updates/break.js";
import { updateSheerField } from "../ui/updates/sheer.js";

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
import { $, qa } from "../ui/dom-helpers.js";

// ---------------- Helper: bind change event ----------------
/**
 * セレクト系のイベントを統一的にバインドする
 * handler → compute の順で実行
 */
function bindChange(id, handler) {
  const el = $(id);
  if (!el) return;

  el.addEventListener("change", () => {
    handler();
    compute();
  });
}

// ---------------- Main binding ----------------
export function bindEvents() {
  // 入力フィールド（input / change）
  ["input", "change"].forEach(type => {
    fields.forEach(id => $(id)?.addEventListener(type, compute));
  });

  // ---------------- Custom Selects ----------------
  document.querySelectorAll(".custom-select").forEach(root => {
    root.addEventListener("select:change", async e => {
      const { id, value } = e.detail;

      switch (id) {
        case "langSelect":
          document.documentElement.setAttribute("lang", value || "jp");
          state.lang = value;
          await loadLanguage();
          updateAgentInfo(i18nDict);
          updateEnemyInfo(i18nDict);
          break;

        case "agentSelect":
          state.agentId = value;
          updateAgentInfo(i18nDict);
          updateMatchSelect();
          updateSheerField();

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
    });
  });

  // ---------------- Mode ----------------
  qa('input[name="calcMode"]').forEach(el =>
    el.addEventListener("change", () => {
      updateVisibilityByMode();
      compute();
    })
  );

  // ---------------- Input ----------------
  bindChange("agentLevel", updateLevelCorrect);
  bindChange("agentLevel", updateLevelCoefficient);

  // ---------------- Toggle ----------------
  const breakToggle = $("breakToggle");
  breakToggle?.addEventListener("change", () => {
    if (breakToggle.checked) miasmaToggle.checked = false;

    updateBreakControls();
    compute();
  });

  const miasmaToggle = $("miasmaToggle");
  miasmaToggle?.addEventListener("change", () => {
    if (miasmaToggle.checked) breakToggle.checked = false;

    updateBreakControls();
    compute();
  });

  // ---------------- Button ----------------
  $("resetBtn")?.addEventListener("click", e => {
    e.preventDefault();
    resetAll();
  });

  // ---------------- Popup ----------------
  const popup = $("infoPopup");

  document.querySelectorAll(".info-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const info = helpTexts[key];
      if (!info) return;

      const popupText = $("popupText");
      popupText.innerHTML = info.text.join("<br>");
      openPopup(popup);
    });
  });

  popup.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", () => closePopup(popup));
  });

  // ---------------- Toast ----------------
  document.addEventListener("click", async e => {
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
