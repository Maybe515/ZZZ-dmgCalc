// 派生フィールド更新
import { $, q, setValue } from "../dom-helpers.js";
import { rangeTable, matchTable, attributes, state, agents } from "../../data/state.js";
import { lvCoeffTable } from "../../data/lv-coefficient-table.js";
import { calcurateLevelCorrect } from "../../calculate/math-utils.js";

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
 * アプリ内データストアから属性ダメージ補正を取得する
 * @param {string} attrId 
 */
function getAnomalyCorr(attrId) {
  return attributes[attrId]?.anomalyCorr ?? 0;
}

/**
 * アプリ内データストアから属性相性補正を取得する
 * @param {string} matchId 
 */
function getMatchValue(matchId) {
  return matchTable[matchId]?.value ?? 0;
}

/**
 * 指定した役割と選択されているエージェントの役割が一致しているか判別する
 * @param {string} target 
 * @returns {Boolean} true / false
 */
export function isValidSpecialty(target) {
  const sel = state.agentId;
  const agent = agents[sel] || {};
  const specialty = agent.specialtyId;
  return specialty === target;
}

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