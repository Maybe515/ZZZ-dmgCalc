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
  rank: "assets/rank/"
};

export const urls = {
  hoyowiki: "https://wiki.hoyolab.com/pc/zzz/entry/"
};

// ---------------- Icons ----------------
export const factionIcons = {
  "cunning_hares": "cunning_hares.webp",
  "belobog_heavy_industries": "belobog_heavy_industries.webp",
  "victoria": "victoria.webp",
  "obol_squad": "obol_squad.webp",
  "sons_of_calydon": "sons_of_calydon.webp",
  "hsos6": "hsos6.webp",
  "neps": "neps.webp",
  "stars_of_lyra": "stars_of_lyra.webp",
  "silver_squad": "silver_squad.webp",
  "mockingbird": "mockingbird.webp",
  "yunkui_summit": "yunkui_summit.webp",
  "spook_shack": "spook_shack.webp",
  "krampus": "krampus.webp"
};

export const specialtyIcons = {
  "attack": "attack.webp",
  "stun": "stun.webp",
  "support": "support.webp",
  "anomaly": "anomaly.webp",
  "defense": "defense.webp",
  "rupture": "rupture.webp"
};

export const attributeIcons = {
  "physical": "physical.webp",
  "electric": "electric.webp",
  "fire": "fire.webp",
  "ice": "ice.webp",
  "ether": "ether.webp",
  "frost": "frost.webp",
  "auric_ink": "auric_ink.webp"
};

export const attributeValueMap = Object.fromEntries(Object.keys(attributeIcons).map(k => [k, k]));