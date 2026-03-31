// UI のイベントバインドを担当するモジュール

// ---------------- Imports ----------------
// Calc
import { compute } from "../calc/compute-handler.js";

// Data loading
import { loadLanguage } from "../data/data-loader.js";

// Select Generate
import { populateSelect } from "../ui/generate-selects.js";

// UI updates
import { updateAgentInfo } from "../ui/updates/agent.js";
import { updateEnemyInfo } from "../ui/updates/enemy.js";
import { updateMatchSelect } from "../ui/updates/match.js";
import { updateLevelCorrect ,updateLevelCoefficient, updateAnomalyCorr, updateWeakRange, updateAttrMatchPct } from "../ui/updates/derived.js";
import { updateVisibilityByMode } from "../ui/updates/mode.js";
import { updateBreakControls } from "../ui/updates/break.js";

// Popup
import { openPopup, closePopup } from "../ui/popup.js";

// Toast
import { showToast } from "../ui/toast.js";
import { getCopyResult } from "../ui/copy.js";

// Init helpers
import { loadLastModified, resetAll } from "./init.js";

// Data
import { agents, enemies, i18nDict, helpTexts } from "../data/state.js";
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

// ---------------- Language change handler ----------------
async function handleLanguageChange() {
  await loadLanguage();

  populateSelect("agentSelect", agents, i18nDict);
  populateSelect("enemySelect", enemies, i18nDict);

  updateAgentInfo(i18nDict);
  loadLastModified();

  localStorage.setItem("lang", $("langSelect").value);
}

// ---------------- Main binding ----------------
export function bindEvents() {
  // 入力フィールド（input / change）
  ["input", "change"].forEach(type => {
    fields.forEach(id => $(id)?.addEventListener(type, compute));
  });

  // セレクト系
  bindChange("langSelect", handleLanguageChange);
  bindChange("agentLevel", updateLevelCorrect);
  bindChange("agentLevel", updateLevelCoefficient);
  bindChange("attrSelect", updateAnomalyCorr);
  bindChange("rangeSelect", updateWeakRange);
  bindChange("matchSelect", updateAttrMatchPct);

  bindChange("agentSelect", () => {
    updateAgentInfo(i18nDict);
    updateMatchSelect();
  });

  bindChange("enemySelect", () => {
    updateEnemyInfo(i18nDict);
    updateMatchSelect();
  });

  // モード切替
  qa('input[name="calcMode"]').forEach(el =>
    el.addEventListener("change", () => {
      updateVisibilityByMode();
      compute();
    })
  );

  // ブレイクトグル
  $("breakToggle")?.addEventListener("change", () => {
    updateBreakControls();
    compute();
  });

  // リセット
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
