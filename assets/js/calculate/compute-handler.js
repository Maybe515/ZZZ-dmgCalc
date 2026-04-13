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
import { miasmaBuffTable, state } from "../data/state.js";

// Calculation modules
import { computeNormal } from "./compute-normal.js";
import { computeAnomaly } from "./compute-anomaly.js";
import { percent } from "./math-utils.js";
import { fmt } from "./fmt.js";
import { isValidSpecialty } from "../core/validation.js";


// ---------------- Cached DOM ----------------
const breakToggle = $("breakToggle");
const miasmaToggle = $("miasmaToggle");

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
  const enemyId = state.enemyId;
  const miasmaBuff = miasmaBuffTable[enemyId] ?? { defUp: 80, dmgCut: 25};

  const digits = Math.max(0, Math.min(6, v.digits));
  
  const validSpecialty = isValidSpecialty("rupture");
  const base = (validSpecialty ? v.sheerForce : v.atk);

  // --- Bonus multipliers ---
  const totalBonus = validSpecialty ?
    1 +
    percent.toFrac(v.attrBonusPct) +
    percent.toFrac(v.dmgBonusPct) +
    percent.toFrac(v.dmgBonusPtPct) +
    percent.toFrac(v.sheerForceDmgBonusPct)
    : 1 +
    percent.toFrac(v.attrBonusPct) +
    percent.toFrac(v.dmgBonusPct) +
    percent.toFrac(v.dmgBonusPtPct);

  const breakBonusMul = breakToggle?.checked
    ? percent.toMul(v.breakBonusPct - 100)
    : 1.0;

  const weakRangeMul = percent.toMul(v.weakRangePct - 100);

  // --- Defense multiplier ---
  const defUpPct = v.defUpPct + (miasmaToggle.checked ? miasmaBuff.defUp : 0);

  const defEff =
    v.def *
    (1 + percent.toFrac(defUpPct) - percent.toFrac(v.defDownPct));

  const defValid = defEff * (1 - percent.toFrac(v.penRatioPct)) - v.pen;

  const defMul = validSpecialty ?
    1 :
    v.lvCoeff / Math.max(1e-9, v.lvCoeff + Math.max(0, defValid));

  // --- Resist multiplier ---
  const resistMul =
    1 -
    percent.toFrac(v.attrMatchPct) +
    percent.toFrac(v.attrResistDownPct) +
    percent.toFrac(v.attrResistIgnorePct);

  // --- Damage Cut multiplier ---
  const dmgCutMul = miasmaToggle.checked ? percent.toFrac(100 - miasmaBuff.dmgCut) : 1;

  // --- Mode-specific compute ---
  const computeFn = mode === "mode--normal" ? computeNormal : computeAnomaly;

  if (mode === "mode--normal") {
    computeFn(
      v,
      base,
      digits,
      totalBonus,
      breakBonusMul,
      weakRangeMul,
      defMul,
      resistMul,
      dmgCutMul,
      setText
    );
  } else {
    computeFn(
      v,
      base,
      digits,
      totalBonus,
      breakBonusMul,
      defMul,
      resistMul,
      dmgCutMul,
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
