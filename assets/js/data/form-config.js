// UI フィールド構成と、保存・復元に使うマッピング定義
/**
 * 数値入力フィールド（compute-handler の collectValues で扱う）
 * UI の <input type="number"> に対応
 */
export const fields = [
  "agentLevel", "lvCorrPct", "atk", "anomalyMastery",
  "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct", "weakRangePct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct",
  "attrResistDownPct", "attrResistIgnorePct", "attrMatchPct",
  "breakBonusPct",
  "digits"
];

/**
 * select / checkbox / radio の UI 要素の ID マッピング
 * storage.js の save/load で使用
 */
export const selectMapping = {
  langSelect: "langSelect",
  modeNormal: "modeNormal",
  agentSelect: "agentSelect",
  attrSelect: "attrSelect",
  rangeSelect: "rangeSelect",
  enemySelect: "enemySelect",
  matchSelect: "matchSelect",
  breakToggle: "breakToggle"
};

/**
 * LocalStorage 復元時に setElementValue で扱う数値キー
 * fields とほぼ同じだが、UI の selectMapping とは別扱い
 */
export const numericKeys = [
  "agentLevel", "atk", "anomalyMastery",
  "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct",
  "attrResistDownPct", "attrResistIgnorePct",
  "breakBonusPct",
  "digits"
];
