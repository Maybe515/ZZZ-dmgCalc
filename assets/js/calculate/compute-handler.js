// 計算処理の中心ロジックを担当するモジュール
// ---------------- Imports ----------------
// DOM
import { $, setText } from "../ui/dom-helpers.js";

// Mode
import { getCalcMode } from "../ui/mode.js";

// Storage
import { saveToLocalStorage } from "../storage/local-storage.js";

// Config / Data
import { fields } from "../data/form-config.js";
import { defaults } from "../data/default.js";

// Calculation modules
import { computeNormal } from "./compute-normal.js";
import { computeAnomaly } from "./compute-anomaly.js";
import { percent } from "./math-utils.js";
import { fmt } from "./fmt.js";

// ---------------- Cached DOM ----------------
const breakToggle = $("breakToggle");

// ---------------- Value Collection ----------------
/**
 * UI の入力値をすべて収集し、数値化して返す
 * 未入力の場合は defaults を使用
 */
export function collectValues() {
  return Object.fromEntries(
    fields.map(key => {
      const raw = $(key)?.value;
      const num = Number(raw);
      return [key, Number.isFinite(num) ? num : defaults[key]];
    })
  );
}

// ---------------- Main Compute ----------------
/**
 * 計算処理のメイン関数
 * UI → 計算 → UI → 保存 の流れを担当
 */
export function compute() {
  const mode = getCalcMode();
  const v = collectValues();

  const digits = Math.max(0, Math.min(6, v.digits));

  // --- Bonus multipliers ---
  const totalBonus =
    1 +
    percent.toFrac(v.attrBonusPct) +
    percent.toFrac(v.dmgBonusPct) +
    percent.toFrac(v.dmgBonusPtPct);

  const breakBonusMul = breakToggle?.checked
    ? percent.toMul(v.breakBonusPct - 100)
    : 1.0;

  const weakRangeMul = percent.toMul(v.weakRangePct - 100);

  // --- Defense multiplier ---
  const defEff =
    v.def *
    (1 + percent.toFrac(v.defUpPct) - percent.toFrac(v.defDownPct));

  const defValid = defEff * (1 - percent.toFrac(v.penRatioPct)) - v.pen;

  const defMul =
    v.lvCoeff / Math.max(1e-9, v.lvCoeff + Math.max(0, defValid));

  // --- Resist multiplier ---
  const resistMul =
    1 -
    percent.toFrac(v.attrMatchPct) +
    percent.toFrac(v.attrResistDownPct) +
    percent.toFrac(v.attrResistIgnorePct);

  // --- Mode-specific compute ---
  const computeFn = mode === "mode--normal" ? computeNormal : computeAnomaly;

  if (mode === "mode--normal") {
    computeFn(
      v,
      digits,
      totalBonus,
      breakBonusMul,
      weakRangeMul,
      defMul,
      resistMul,
      setText
    );
  } else {
    computeFn(
      v,
      digits,
      totalBonus,
      breakBonusMul,
      defMul,
      resistMul,
      setText
    );
  }

  // --- Display multipliers ---
  setText("totalBonus", fmt(totalBonus, digits + 2));
  setText("defMul", fmt(defMul, digits + 2));
  setText("resistMul", fmt(resistMul, digits + 2));

  // --- Save state ---
  saveToLocalStorage();
}

// ---------------- Element Helpers ----------------
/**
 * 値を要素にセット（checkbox / radio 対応）
 */
export function setElementValue(el, value) {
  if (!el) return;

  if (el.type === "checkbox" || el.type === "radio") {
    el.checked = !!value;
  } else {
    el.value = value;
  }
}

/**
 * 要素から値を取得（checkbox / radio 対応）
 */
export function getElementValue(el) {
  if (!el) return undefined;

  if (el.type === "checkbox" || el.type === "radio") {
    return el.checked;
  }

  return el.value;
}
