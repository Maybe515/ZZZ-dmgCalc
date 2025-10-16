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
  rangeWeakPct: 100,
  enemLevel: 60,
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
  "邪兎屋": "cunning_hares.webp",
  "白祇重工": "belobog_heavy_industries.webp",
  "ヴィクトリア家政": "victoria.webp",
  "オボルス小隊": "obol_squad.webp",
  "カリュドーンの子": "sons_of_calydon.webp",
  "対ホロウ特別行動部第六課": "hsos6.webp",
  "特務捜査班": "neps.webp",
  "スターズ・オブ・リラ": "stars_of_lyra.webp",
  "防衛軍・シルバー小隊": "silver_squad.webp",
  "モッキンバード": "mockingbird.webp",
  "雲嶽山": "yunkui_summit.webp",
  "怪啖屋": "spook_shack.webp"
};

export const specialtyIcons = {
  "強攻": "attack.webp",
  "撃破": "stun.webp",
  "支援": "support.webp",
  "異常": "anomaly.webp",
  "防護": "defense.webp",
  "命破": "rupture.webp"
};

export const attributeIcons = {
  "物理": "physical.webp",
  "電気": "electric.webp",
  "炎": "fire.webp",
  "氷": "ice.webp",
  "エーテル": "ether.webp",
  "霜烈": "frost.webp",
  "玄墨": "auric_ink.webp"
};

export const attributeValueMap = {
  "物理": "physical",
  "電気": "electric",
  "炎": "fire",
  "氷": "ice",
  "エーテル": "ether",
  "霜烈": "frost",
  "玄墨": "auric_ink"
};
