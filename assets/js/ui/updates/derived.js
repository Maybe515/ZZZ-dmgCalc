// 派生フィールド更新
import { $, setValue } from "../dom-helpers.js";
import { rangeTable, matchTable, attributes, state } from "../../data/state.js";
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

function getAnomalyCorr(attrId) {
  return attributes[attrId]?.anomalyCorr ?? 0;
}

function getMatchValue(matchId) {
  return matchTable[matchId]?.value ?? 0;
}
