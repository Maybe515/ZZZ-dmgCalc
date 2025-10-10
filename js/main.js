// main.js
import { computeNormal, computeAnomaly, fmt, percent } from "./calc.js";
import { $, q, qa, setText, setValue, bindCopyButtons } from "./ui.js";
import { defaults, anomalyCorrTable, rangeTable, matchTable, paths, factionIcons, specialtyIcons, attributeIcons, attributeValueMap } from "./data.js";

// ---------------- Data ----------------
const agents = {};
const enemies = {};
const lvCoeffTable = {};

const fields = [
  "agentLevel", "lvCorrPct", "atk", "anomalyMastery", "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct", "breakBonusPct", "rangeWeakPct",
  "enemLevel", "lvCoeff", "def", "defUpPct", "defDownPct",
  "attrMatchPct", "attrResiDownPct", "attrResiIgnorePct",
  "digits"
];

// ---------------- Agent Info ----------------
function updateAgentInfo() {
  const sel = $("agentSelect")?.value;
  const agent = agents[sel] || {};

  ["faction", "specialty", "attribute"].forEach(key => {
    const el = $(key);
    if (!el) return;
    el.textContent = agent[key] || "-";
    el.title = el.textContent;
  });

  // アイコン更新
  const updateFieldWithIcon = (id, value, iconPath, iconMap, altPrefix = "") => {
    const valueEl = $(id);
    if (valueEl) {
      valueEl.textContent = (value ?? "-");
      valueEl.title = valueEl.textContent;
    }
    const iconEl = $(id + "Icon");
    if (!iconEl || !iconPath || !iconMap) return;
    if (value && iconMap[value]) {
      iconEl.src = iconPath + iconMap[value];
      iconEl.alt = altPrefix ? `${altPrefix}: ${value}` : value;
    } else {
      iconEl.src = "";
      iconEl.alt = "";
    }
  };

  updateFieldWithIcon("faction", agent.faction, paths.faction, factionIcons, "陣営");
  updateFieldWithIcon("specialty", agent.specialty, paths.specialty, specialtyIcons, "役割");
  updateFieldWithIcon("attribute", agent.attribute, paths.attribute, attributeIcons, "属性");

  // 属性選択反映
  const attrSelect = $("attrSelect");
  if (attrSelect) {
    attrSelect.value = attributeValueMap[agent.attribute] ?? "";
    updateAnomalyCorr();
  }

  // 画像・ランク
  const agentEl = $("agentImage");
  if (agentEl) {
    agentEl.src = agent.image ? paths.agent + agent.image : "";
    agentEl.alt = agent.image ? `画像:${sel}` : "";
  }
  const rankEl = $("rankImage");
  if (rankEl) {
    rankEl.src = agent.rank ? `${paths.rank}rank_${agent.rank}.png` : "";
    rankEl.alt = agent.rank ? `ランク${agent.rank}` : "";
  }
}

// ---------------- Mode handling ----------------
const getCalcMode = () => q('input[name="calcMode"]:checked')?.value || "normal";
function updateVisibilityByMode() {
  const mode = getCalcMode();
  qa(".is-disabled-normal").forEach(el => el.classList.toggle("is-disabled", mode === "normal"));
  qa(".is-disabled-anomaly").forEach(el => el.classList.toggle("is-disabled", mode === "anomaly"));
  qa(".is-hidden-anomaly").forEach(el => { el.style.display = (mode === "anomaly") ? "none" : ""; });
  document.body.dataset.mode = mode;
}

// ---------------- Derived field updates ----------------
const updateAnomalyCorr = () => setValue("anomalyCorrPct", anomalyCorrTable[$("attrSelect")?.value] ?? 0);
const updateRangeWeak = () => setValue("rangeWeakPct", rangeTable[$("rangeSelect")?.value] ?? 100);
const updateAttrMatchPct = () => setValue("attrMatchPct", matchTable[$("matchSelect")?.value] ?? 0);

// ---------------- Break controls ----------------
const breakToggle = $("breakToggle");
const breakControls = $("breakControls");
const updateBreakControls = () => breakControls?.classList.toggle("is-disabled", !breakToggle?.checked);

// ---------------- Compute ----------------
function compute() {
  const mode = getCalcMode();
  const v = Object.fromEntries(fields.map(k => [k, Number($(k)?.value) || defaults[k]]));
  const digits = Math.max(0, Math.min(6, v.digits));

  const totalBonus = 1
    + percent.toFrac(v.attrBonusPct)
    + percent.toFrac(v.dmgBonusPct)
    + percent.toFrac(v.dmgBonusPtPct);

  const breakBonusMul = breakToggle?.checked ? percent.toMul(v.breakBonusPct - 100) : 1.0;
  const rangeWeakMul = percent.toMul(v.rangeWeakPct - 100);

  const defEff = v.def * (1 + percent.toFrac(v.defUpPct) - percent.toFrac(v.defDownPct));
  const defValid = defEff * (1 - percent.toFrac(v.penRatioPct)) - v.pen;
  const defMul = v.lvCoeff / Math.max(1e-9, (v.lvCoeff + Math.max(0, defValid)));

  const resistMul = 1
    - percent.toFrac(v.attrMatchPct)
    + percent.toFrac(v.attrResiDownPct)
    + percent.toFrac(v.attrResiIgnorePct);

  if (mode === "normal") {
    computeNormal(v, digits, totalBonus, breakBonusMul, rangeWeakMul, defMul, resistMul, setText);
  } else {
    computeAnomaly(v, digits, totalBonus, breakBonusMul, defMul, resistMul, setText);
  }

  setText("totalBonus", fmt(totalBonus, digits + 2));
  setText("defMul", fmt(defMul, digits + 2));
  setText("resiMul", fmt(resistMul, digits + 2));
}

// ---------------- Defaults & Reset ----------------
function applyDefaults(force = false) {
  fields.forEach(k => {
    const el = $(k);
    if (!el) return;
    if (force || el.value === "" || el.value == null) {
      el.value = defaults[k];
    }
  });
  updateAnomalyCorr();
  updateRangeWeak();
  updateAttrMatchPct();
  updateBreakControls();
}
function resetAll() {
  applyDefaults(true);
  compute();
}

// ---------------- Data loading ----------------
async function loadJSON(path, target, callback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} 読み込み失敗`);
    const data = await res.json();
    Object.assign(target, data);
    callback?.(data);
  } catch (err) {
    console.error(err);
  }
}
async function loadAllData() {
  await Promise.all([
    loadJSON("./json/agents.json", agents, () => populateSelect("agentSelect", agents)),
    loadJSON("./json/enemies.json", enemies, () => populateSelect("enemSelect", enemies)),
    loadJSON("./json/lvCoeffTable.json", lvCoeffTable)
  ]);
}
function populateSelect(id, data) {
  const select = $(id);
  if (!select) return;
  const options = [`<option value="">-- 選択してください --</option>`]
    .concat(Object.keys(data).map(name => `<option value="${name}">${name}</option>`));
  select.innerHTML = options.join("");
}

// ---------------- Result fixed (mobile) ----------------
function syncResultFixedContent() {
  const resultSection = q(".result");
  const fixed = q(".result.result--fixed");
  if (!resultSection || !fixed) return;
  fixed.innerHTML = resultSection.innerHTML;
}

function initResultFixedObserver() {
  const fixed = q(".result.result--fixed");
  const normal = q(".result:not(.result--fixed)");
  if (!fixed || !normal) return;

  const mo = new MutationObserver(syncResultFixedContent);
  mo.observe(normal, { childList: true, subtree: true, characterData: true });
  syncResultFixedContent();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting === false) fixed.classList.add("is-visible");
        else fixed.classList.remove("is-visible");
      },
      { threshold: 0.01, root: null, rootMargin: "0px 0px 30px 0px" }
    );
    io.observe(normal);
  } else {
    const toggle = () => {
      if (window.innerWidth > 1000) {
        fixed.classList.remove("is-visible");
        return;
      }
      const rect = normal.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 20 && rect.bottom > 0;
      fixed.classList.toggle("is-visible", !isVisible);
    };
    window.addEventListener("scroll", toggle);
    window.addEventListener("resize", toggle);
    toggle();
  }
}

// ---------------- Event binding ----------------
function bindEvents() {
  ["input", "change"].forEach(type => {
    fields.forEach(id => {
      const el = $(id);
      if (el) el.addEventListener(type, compute);
    });
  });

  $("attrSelect")?.addEventListener("change", () => { updateAnomalyCorr(); compute(); });
  $("rangeSelect")?.addEventListener("change", () => { updateRangeWeak(); compute(); });
  $("matchSelect")?.addEventListener("change", () => { updateAttrMatchPct(); compute(); });

  $("agentSelect")?.addEventListener("change", () => { updateAgentInfo(); compute(); });

  $("enemSelect")?.addEventListener("change", () => {
    const enem = enemies[$("enemSelect")?.value] || {};
    setText("attrWeak", enem.attrWeak ?? "-");
    setText("attrResist", enem.attrResist ?? "-");
    compute();
  });

  $("agentLevel")?.addEventListener("input", () => {
    const level = Number($("agentLevel")?.value ?? defaults.agentLevel);
    const corrMulPct = (1 + 0.016949 * (level - 1)) * 100;
    setValue("lvCorrPct", fmt(corrMulPct, 2));
    setValue("lvCoeff", lvCoeffTable[level] ?? defaults.lvCoeff);
    compute();
  });

  qa('input[name="calcMode"]').forEach(el =>
    el.addEventListener("change", () => { updateVisibilityByMode(); compute(); })
  );

  $("breakToggle")?.addEventListener("change", () => { updateBreakControls(); compute(); });

  $("resetBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    resetAll();
  });
}

// ---------------- Init ----------------
async function init() {
  // データロード
  await loadAllData();

  // デフォルト適用
  applyDefaults();

  // 初期表示と依存項目反映
  updateAgentInfo();
  updateVisibilityByMode();
  updateAnomalyCorr();
  updateRangeWeak();
  updateAttrMatchPct();
  updateBreakControls();

  // イベントバインド
  bindEvents();
  bindCopyButtons();
  initResultFixedObserver();

  // 初回計算
  compute();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
