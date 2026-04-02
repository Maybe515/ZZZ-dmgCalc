// 入力フィールドおよびセレクト要素のデフォルト値
/**
 * 数値入力フィールドのデフォルト値
 * 計算ロジックの基礎となる初期パラメータ
 */
export const defaults = {
  agentLevel: 60,
  lvCorrPct: 200,
  atk: 1500,
  anomalyMastery: 100,

  penRatioPct: 0,
  pen: 0,

  critRatePct: 5,
  critDmgPct: 50,

  attrBonusPct: 0,
  dmgBonusPct: 0,
  dmgBonusPtPct: 0,

  skillPct: 240,
  anomalyCorrPct: 0,
  weakRangePct: 100,

  enemyLevel: 60,
  lvCoeff: 794,
  def: 571.7,

  defUpPct: 0,
  defDownPct: 0,

  attrMatchPct: 0,
  attrResistDownPct: 0,
  attrResistIgnorePct: 0,

  breakBonusPct: 100,

  digits: 0
};

/**
 * セレクト・トグル UI のデフォルト値
 * UI 初期化や resetAll() で使用
 */
export const selectDefaults = {
  modeNormal: true,
  agentSelect: "",
  attrSelect: "",
  rangeSelect: "0-15",
  enemySelect: "",
  matchSelect: "none",
  breakToggle: false
};
