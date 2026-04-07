// UI フィールド構成と、保存・復元に使うマッピング定義
/**
 * 数値入力フィールド（compute-handler の collectValues で扱う）
 * UI の <input type="number"> に対応
 */
export const fields = [
  "agentLevel", "lvCorrPct", "atk", "sheerForce", "anomalyMastery",
  "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct", "sheerForceDmgBonusPct",
  "skillPct", "anomalyCorrPct", "weakRangePct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct",
  "attrResistDownPct", "attrResistIgnorePct", "attrMatchPct",
  "breakBonusPct",
  "digits"
];

/**
 * select の UI 要素の ID マッピング
 * local-storage.js の save/load で使用
 */
export const selectMapping = {
  lang: { id: "langSelect", state: "lang" },
  agent: { id: "agentSelect", state: "agentId" },
  enemy: { id: "enemySelect", state: "enemyId" },
  attribute: { id: "attrSelect", state: "attrId" },
  range: { id: "rangeSelect", state: "range" },
  attrMatch: { id: "matchSelect", state: "match" },
};

/**
 * checkbox / radio の UI 要素の ID マッピング
 * local-storage.js の save/load で使用
 */
export const toggleMapping = {
  breakToggle:  { id: "breakToggle",  state: "breakToggle" },
  breakToggle:  { id: "breakToggle",  state: "breakToggle" },
  miasmaToggle: { id: "miasmaToggle", state: "miasmaToggle" }
};

/**
 * LocalStorage 復元時に setElementValue で扱う数値キー
 * fields とほぼ同じだが、UI の selectMapping とは別扱い
 */
export const numericKeys = [
  "agentLevel", "atk", "sheerForce", "anomalyMastery",
  "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct", "sheerForceDmgBonusPct",
  "skillPct", "anomalyCorrPct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct",
  "attrResistDownPct", "attrResistIgnorePct",
  "breakBonusPct",
  "digits"
];
