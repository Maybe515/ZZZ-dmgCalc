// 派生フィールド更新
import { $, q, setValue } from "../../utils/dom-helpers.js";
import { rangeTable, state } from "../../data/state.js";
import { lvCoeffTable } from "../../data/lv-coefficient-table.js";
import { calcurateLevelCorrect } from "../../utils/math-utils.js";
import { getAnomalyCorr, getMatchValue } from "./update-helpers.js";
import { isValidSpecialty } from "../../core/validation.js";

export const updateLevelCorrect = () =>
  setValue("lvCorrPct", calcurateLevelCorrect($("agentLevel")?.value) ?? 0);

export const updateLevelCoefficient = () =>
  setValue("lvCoeff", lvCoeffTable[$("agentLevel")?.value] ?? 0);

export const updateAnomalyCorr = () =>
  setValue("anomalyCorrPct", getAnomalyCorr(state.attrId));

export const updateWeakRange = () =>
  setValue("weakRangePct", rangeTable[state.range] ?? 100);

export const updateAttrMatchPct = () =>
  setValue("attrMatchPct", getMatchValue(state.match));

/**
 * 最終攻撃力フィールドを制御する
*/
export function refreshAttackField() {
  const atk = $("atk");
  const atkLabel = q('label[for="atk"]');

  const invisible = isValidSpecialty("rupture");

  atk.classList.toggle("is-invisible", invisible);
  atkLabel.classList.toggle("is-invisible", invisible);
}

/**
 * 透徹に関するフィールドを制御する
*/
export function refreshSheerField() {
  const sheerForce = $("sheerForce");
  const sheerForceLabel = q('label[for="sheerForce"]');
  const sheerForceDmgBonus = $("sheerForceDmgBonusPct");
  const sheerForceDmgBonusLabel = q('label[for="sheerForceDmgBonusPct"]');

  const invisible = !isValidSpecialty("rupture");

  sheerForce.classList.toggle("is-invisible", invisible);
  sheerForceLabel.classList.toggle("is-invisible", invisible);

  sheerForceDmgBonus.classList.toggle("is-invisible", invisible);
  sheerForceDmgBonusLabel.classList.toggle("is-invisible", invisible);
}

