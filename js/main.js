// main.js
import { computeNormal, computeAnomaly, fmt, percent } from "./calc.js";
import { $, q, qa, setText, setValue, bindCopyButtons } from "./ui.js";
import { defaults, selectDefaults, anomalyCorrTable, rangeTable, matchTable, paths, urls, factionIcons, specialtyIcons, attributeIcons, attributeValueMap } from "./data.js";
import { loadLanguage, bindLanguageToggle } from "./lang.js";

// ---------------- Data ----------------
const agents = {};
const enemies = {};
const lvCoeffTable = {};
const helpTexts = {};

const fields = [
  "agentLevel", "lvCorrPct", "atk", "anomalyMastery", "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct", "rangeWeakPct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct", "attrResiDownPct", "attrResiIgnorePct", "attrMatchPct",
  "breakBonusPct",
  "digits"
];

// select系・checkbox系の初期値マッピング表
const selectMapping = {
  modeNormal: "modeNormal",
  agentSelect: "agentSelect",
  attrSelect: "attrSelect",
  rangeSelect: "rangeSelect",
  enemySelect: "enemySelect",
  matchSelect: "matchSelect",
  breakToggle: "breakToggle"
};

// ---------------- DOM Helpers ----------------
function updateText(id, value) {
  const el = $(id);
  if (!el) return;
  el.textContent = value ?? "-";
  el.title = el.textContent;
}

function updateIcon(id, value, iconPath, iconMap, altPrefix = "") {
  updateText(id, value);
  const el = $(id + "Icon");
  if (!el) return;
  if (value && iconMap[value]) {
    el.src = iconPath + iconMap[value];
    el.alt = altPrefix ? `${altPrefix}: ${value}` : value;
  } else {
    el.src = "";
    el.alt = "";
  }
}

function updateImage(id, src, alt) {
  const el = $(id);
  if (!el) return;
  el.src = src || "";
  el.alt = alt || "";
}

function updateLink(id, link) {
  const el = $(id);
  if (!el) return;
  el.href = link || "#";
  el.style.pointerEvents = link ? "auto" : "none";  // リンクが無い場合は無効化
}

// ---------------- Agent Info ----------------
function updateAgentInfo() {
  const sel = $("agentSelect")?.value;
  const agent = agents[sel] || {};

  updateText("faction", agent.faction);
  updateText("specialty", agent.specialty);
  updateText("attribute", agent.attribute);

  updateIcon("faction", agent.faction, paths.faction, factionIcons, "陣営");
  updateIcon("specialty", agent.specialty, paths.specialty, specialtyIcons, "役割");
  updateIcon("attribute", agent.attribute, paths.attribute, attributeIcons, "属性");

  // 属性選択反映
  const attrSelect = $("attrSelect");
  if (attrSelect) {
    attrSelect.value = attributeValueMap[agent.attribute] ?? "";
    updateAnomalyCorr();
  }

  // 画像とランク
  updateImage("agentImage", agent.image ? paths.agent + agent.image : "", agent.image ? `画像:${sel}` : "");
  updateImage("rankImage", agent.rank ? `${paths.rank}rank_${agent.rank}.png` : "", agent.rank ? `ランク${agent.rank}` : "");

  // リンク
  updateLink("agentLink", agent.link ? urls.hoyowiki + agent.link : "");
}

// ---------------- Mode handling ----------------
const getCalcMode = () => q('input[name="calcMode"]:checked')?.value || "mode--normal";

function updateVisibilityByMode() {
  const mode = getCalcMode();
  const toggleClasses = [
    { selector: ".is-disabled-normal", condition: mode === "mode--normal" },
    { selector: ".is-disabled-anomaly", condition: mode === "mode--anomaly" }
  ];
  toggleClasses.forEach(({ selector, condition }) =>
    qa(selector).forEach(el => el.classList.toggle("is-disabled", condition))
  );
  qa(".is-hidden-anomaly").forEach(el => { el.style.display = (mode === "mode--anomaly") ? "none" : ""; });
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
function collectValues() {
  return Object.fromEntries(fields.map(k => [k, Number($(k)?.value) || defaults[k]]));
}

function compute() {
  const mode = getCalcMode();
  const v = collectValues();
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

  const computeFn = (mode === "mode--normal") ? computeNormal : computeAnomaly;
  if (mode === "mode--normal") {
    computeFn(v, digits, totalBonus, breakBonusMul, rangeWeakMul, defMul, resistMul, setText);
  }
  else {
    computeFn(v, digits, totalBonus, breakBonusMul, defMul, resistMul, setText);
  }

  setText("totalBonus", fmt(totalBonus, digits + 2));
  setText("defMul", fmt(defMul, digits + 2));
  setText("resiMul", fmt(resistMul, digits + 2));

  saveToLocalStorage();
}

// ---------------- Defaults & Reset ----------------
// 共通: 要素に値を適用する関数
function setElementValue(el, value) {
  if (!el) return;
  if (el.type === "checkbox" || el.type === "radio") {
    el.checked = !!value;
  } else {
    el.value = value;
  }
}

function applyDefaults(force = false) {
  fields.forEach(k => {
    const el = $(k);
    if (!el) return;
    if (force || el.value === "" || el.value == null) {
      setElementValue(el, defaults[k]);
    }
  });

  updateAgentInfo();
  updateVisibilityByMode();
  updateAnomalyCorr();
  updateRangeWeak();
  updateAttrMatchPct();
  updateBreakControls();
}

function resetAll() {
  Object.entries(selectMapping).forEach(([key, id]) => {
    setElementValue($(id), selectDefaults[key]);
  });

  applyDefaults(true);
  compute();
}

// ---------------- Data loading ----------------
async function loadJSON(path, target, callback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} 読み込み失敗`);
    const data = await res.json();

    if (Array.isArray(target) && Array.isArray(data)) {
      // 配列なら中身を置き換える
      target.splice(0, target.length, ...data);
    } else if (typeof target === "object") {
      // オブジェクトならマージ
      Object.assign(target, data);
    }

    callback?.(data);
    return data; // Promise.allで結果を受け取れるように
  } catch (err) {
    console.error(err);
  }
}

async function loadAllData() {
  return Promise.all([
    loadJSON("./json/agents.json", agents, () => populateSelect("agentSelect", agents)),
    loadJSON("./json/enemies.json", enemies, () => populateSelect("enemySelect", enemies)),
    loadJSON("./json/lvCoeffTable.json", lvCoeffTable),
    loadJSON("./json/helpTexts.json", helpTexts)
  ]);
}

function populateSelect(id, data) {
  const select = $(id);
  if (!select) return;
  const options = [`<option value="">-- 選択してください --</option>`]
    .concat(Object.keys(data).map(name => `<option value="${name}">${name}</option>`));
  select.innerHTML = options.join("");
}

// ---------------- Local Storage ----------------
function saveToLocalStorage() {
  const params = {
    mode: getCalcMode(),
    agent: $("agentSelect")?.value,
    attribute: $("attrSelect")?.value,
    range: $("rangeSelect")?.value,
    enemy: $("enemySelect")?.value,
    attrMatch: $("matchSelect")?.value,
    breakToggle: $("breakToggle")?.checked,
    ...collectValues()
  };

  // マッピング表に従って保存
  Object.entries(selectMapping).forEach(([key, id]) => {
    const el = $(id);
    if (!el) return;
    params[key] = el.value;
  });

  localStorage.setItem("lastParams", JSON.stringify(params));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("lastParams");
  if (!saved) return;

  const params = JSON.parse(saved);
  params.mode === "mode--normal" ? $("modeNormal").checked = true : $("modeAnomaly").checked = true;

  // マッピング表に従って復元
  Object.entries(selectMapping).forEach(([key, id]) => {
    if (params[key] !== undefined) {
      const el = $(id);
      if (!el) return;

      if (el.type === "checkbox") {
        el.checked = params[key];
      } else {
        el.value = params[key];
      }
    }
  });

  // collectValues() で扱う数値系の復元
  const numericKeys = [
    "agentLevel", "atk", "anomalyMastery", "penRatioPct", "pen",
    "critRatePct", "critDmgPct", "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
    "skillPct", "anomalyCorrPct", "enemyLevel", "lvCoeff", "def",
    "defUpPct", "defDownPct", "attrResiDownPct", "attrResiIgnorePct",
    "breakBonusPct", "digits"
  ];

  numericKeys.forEach(key => {
    if (params[key] !== undefined) {
      const el = $(key);
      if (el) el.value = params[key];
    }
  });
}

// ---------------- Result fixed (mobile) ----------------
function syncResultFixedContent() {
  const resultSection = q(".result");
  const fixed = q(".result.result--fixed");
  if (resultSection && fixed) {
    fixed.innerHTML = resultSection.innerHTML;
  }
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
      ([entry]) => {
        fixed.classList.toggle("is-visible", entry && !entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: "0px 0px 30px 0px" }
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

// ---------------- Misc ----------------
function loadLastModified() {
  const el = $("lastModified");
  if (!el) return;
  const d = new Date(document.lastModified);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  el.textContent = `Last Modified: ${y}/${m}/${day}`;
}

// ---------------- Event binding ----------------
function bindEvents() {
  // 入力フィールド
  ["input", "change"].forEach(type => {
    fields.forEach(id => $(id)?.addEventListener(type, compute));
  });

  $("attrSelect")?.addEventListener("change", () => { updateAnomalyCorr(); compute(); });
  $("rangeSelect")?.addEventListener("change", () => { updateRangeWeak(); compute(); });
  $("matchSelect")?.addEventListener("change", () => { updateAttrMatchPct(); compute(); });
  $("agentSelect")?.addEventListener("change", () => { updateAgentInfo(); compute(); });

  $("enemySelect")?.addEventListener("change", () => {
    const enem = enemies[$("enemySelect")?.value] || {};
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
  $("resetBtn")?.addEventListener("click", (e) => { e.preventDefault(); resetAll(); });

  bindLanguageToggle();

  // 共通ポップアップ制御
  const popup = document.getElementById("infoPopup");
  const popupText = document.getElementById("popupText");

  function openPopup() {
    popup.style.display = "block"; // 再表示
    popup.classList.add("is-open");
    popup.classList.remove("is-closing");
    popup.setAttribute("aria-hidden", "false");
  }

  function closePopup() {
    popup.classList.add("is-closing");
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");

    popup.addEventListener("animationend", () => {
      popup.classList.remove("is-closing");
      popup.style.display = "none";
    }, { once: true });
  }

  document.querySelectorAll(".info-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (helpTexts[key]) {
        popupText.innerHTML = helpTexts[key].text.join("<br>");  // JSONから差し込み
        openPopup();
      }
    });
  });

  // 閉じる処理
  popup.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", closePopup);
  });
}

// ---------------- Init ----------------
async function init() {
  await loadAllData();
  loadLastModified();
  loadLanguage();

  loadFromLocalStorage();

  applyDefaults();
  updateAgentInfo();
  updateVisibilityByMode();
  updateAnomalyCorr();
  updateRangeWeak();
  updateAttrMatchPct();
  updateBreakControls();

  bindEvents();
  bindLanguageToggle();
  bindCopyButtons();
  initResultFixedObserver();

  compute();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
