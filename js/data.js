// data.js
// ---------------- Defaults ----------------
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
  attrResiDownPct: 0,
  attrResiIgnorePct: 0,
  breakBonusPct: 100,
  digits: 0
};

export const selectDefaults = {
  modeNormal: true,
  agentSelect: "",
  attrSelect: "",
  rangeSelect: "0-15",
  enemySelect: "",
  matchSelect: "none",
  breakToggle: false
};

// ---------------- Tables ----------------
export const anomalyCorrTable = {
  physical: 713,
  electric: 1250,
  fire: 1000,
  ice: 500,
  ether: 1250,
  frost: 500,
  auric_ink: 1250
};

export const rangeTable = {
  "0-15": 100,
  "15-20": 75,
  "20-25": 50,
  "25-": 25
};

export const matchTable = {
  none: 0,
  weak: -20,
  resist: 20
};

// ---------------- Paths ----------------
export const paths = {
  base: "assets/",
  faction: "assets/faction/",
  specialty: "assets/specialty/",
  attribute: "assets/stats/",
  agent: "assets/agent/",
  enemy: "assets/enemy/",
  rank: "assets/rank/"
};

export const urls = {
  hoyowiki: "https://wiki.hoyolab.com/pc/zzz/entry/"
};

// ---------------- Ids ----------------
export const attributeIds = [
  "physical",
  "electric",
  "fire",
  "ice",
  "ether",
  "frost",
  "auric_ink"
];

export const attributeValueMap = Object.fromEntries(attributeIds.map(k => [k, k]));