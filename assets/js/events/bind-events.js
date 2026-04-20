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
import { resetAll, setupStrap } from "./init.js";

// Data
import { i18nDict, helpTexts, state, agents, selects } from "../data/state.js";
import { fields } from "../data/form-config.js";

// DOM helpers
import { $, al, q, qa, sa } from "../utils/dom-helpers.js";
import { getDocumentCenter, toWrapperCoords } from "../utils/coords.js";

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

  // ---------------- Result ----------------
  const wrapper = $("resultFixedWrapper");
  const tab = $("resultFixedTab");

  al("click", () => {
    wrapper.classList.toggle("is-visible");
  }, tab);
}

export function bindDetailsEvents() {
  const ANIMATION_DURATION = 400;     // CSS のアニメーション時間と合わせる
  const detailsList = qa("details");

  detailsList.forEach(details => {
    const summary = q("summary", details);
    if (!summary) return;

    al("click", e => {
      if (!details.open) return;

      // デフォルトの即閉じを止める
      e.preventDefault();

      // アニメーション開始
      details.classList.add("is-closing");

      // アニメーション終了後に閉じる
      setTimeout(() => {
        details.classList.remove("is-closing");
        details.removeAttribute("open");
      }, ANIMATION_DURATION);
    }, summary);
  });
}

export function bindCustomSelectEvents(select) {
  const { root, display, list, items, updateDisplay, id } = select;

  // アイテム選択
  items.forEach(item => {
    al("click", () => {
      const value = item.dataset.value;
      updateDisplay(value);

      display.classList.remove("open");
      list.classList.remove("open");

      root.dispatchEvent(
        new CustomEvent("select:change", {
          detail: { id, value }
        })
      );
    }, item);
  });

  // 開閉
  al("click", () => {
    const isOpen = list.classList.toggle("open");
    display.classList.toggle("open", isOpen);
  }, display);

  // 外側クリックで閉じる
  al("click", e => {
    if (!root.contains(e.target)) {
      display.classList.remove("open");
      list.classList.remove("open");
    }
  });
}

export function bindStrapEvents() {
  let dragging = false;
  let moved = false;

  const debounce = 150;
  let resizeTimer = null;

  al("click", e => {
    if (moved) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return; // ← ドラッグ後の click を無効化
    }
    window.strapState?.strap?.nudge(0.3);
  }, $("strapCircle"));

  al("dragstart", e => { e.preventDefault(); }, $("strapCircle"));

  al("mousedown", () => {
    dragging = true;
    moved = false;
    window.strapState?.strap?.pause();
  }, $("strapCircle"));

  al("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    window.strapState?.strap?.resume();
  });

  al("mousemove", e => {
    if (!dragging) return;

    const { strap, wrapper, anchor, line } = window.strapState;

    // ★ アンカーの画面上の中心座標を原点にする
    const anchorCenter = getDocumentCenter(anchor);
    const dx = e.pageX - anchorCenter.x;
    const dy = e.pageY - anchorCenter.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;   // ← ドラッグと判定
    
    const angle = Math.atan2(dx, dy); // 単振り子の角度に合わせる
    const local = toWrapperCoords(wrapper, e.pageX, e.pageY);
    const newLength = line.updateWithPoint(local.x, local.y);

    strap.setLength(newLength);
    strap.setAngle(angle);
  });

  al("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.strapState = setupStrap();   // 再初期化のみ
    }, debounce);
  }, window);
}
