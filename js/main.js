// main.js
import { computeNormal, computeAnomaly, fmt, percent } from "./calc.js";
import { $, q, qa, setText, setValue, bindCopyButtons } from "./ui.js";
import { defaults, selectDefaults, anomalyCorrTable, rangeTable, matchTable, paths, urls, attributeValueMap } from "./data.js";
import { applyLanguage } from "./lang.js";

// ---------------- 辞書参照ヘルパー ----------------
const t = (dict, key, fallback = "") => (dict && dict[key] !== undefined ? dict[key] : fallback);

// ---------------- Data ----------------
const agents = {};
const enemies = {};
const lvCoeffTable = {};
const helpTexts = {};
const i18nDict = {};

const fields = [
  "agentLevel", "lvCorrPct", "atk", "anomalyMastery", "penRatioPct", "pen",
  "critRatePct", "critDmgPct",
  "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct", "weakRangePct",
  "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct", "attrResiDownPct", "attrResiIgnorePct", "attrMatchPct",
  "breakBonusPct",
  "digits"
];

// select系・checkbox系の初期値マッピング表
const selectMapping = {
  langSelect: "langSelect",
  modeNormal: "modeNormal",
  agentSelect: "agentSelect",
  attrSelect: "attrSelect",
  rangeSelect: "rangeSelect",
  enemySelect: "enemySelect",
  matchSelect: "matchSelect",
  breakToggle: "breakToggle"
};

// collectValues() で扱う数値系の復元
const numericKeys = [
  "agentLevel", "atk", "anomalyMastery", "penRatioPct", "pen",
  "critRatePct", "critDmgPct", "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
  "skillPct", "anomalyCorrPct", "enemyLevel", "lvCoeff", "def",
  "defUpPct", "defDownPct", "attrResiDownPct", "attrResiIgnorePct",
  "breakBonusPct", "digits"
];

// ---------------- DOM Helpers ----------------
function updateText(id, value) {
  const el = $(id);
  if (!el) return;
  el.textContent = value || "";
  el.title = value || "";
  el.style.display = value ? "" : "none";
}

function updateIcon(id, key, iconPath, altLabel = "", ext = ".webp") {
  const el = $(id + "Icon");
  if (!el) return;
  if (key && key !== "none") {
    el.src = `${iconPath}${key}${ext}`;
    el.alt = altLabel ? `${altLabel}: ${t(i18nDict, `${id}.${key}`, key)}` : key;
    el.style.display = "";
  } else {
    el.src = "";
    el.alt = "";
    el.style.display = "none";
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

function updateAttrGroup(attrs, prefix, dict) {
  for (let i = 0; i < 2; i++) {
    const attrId = attrs[i];
    const baseId = `${prefix}${i + 1}`;

    updateText(baseId, attrId && attrId !== "none" ? t(dict, `attribute.${attrId}`, attrId) : "");
    updateIcon(baseId, attrId, paths.attribute, t(dict, "ui.attributeLabel", "Attribute"));
  }
}

function updateMatchSelect() {
  const attribute = $("attribute").textContent.trim();
  const weakAttr1 = $("weakAttr1").textContent.trim();
  const weakAttr2 = $("weakAttr2").textContent.trim();
  const resistAttr1 = $("resistAttr1").textContent.trim();
  const resistAttr2 = $("resistAttr2").textContent.trim();
  const matchSelect = $("matchSelect");

  if (attribute === weakAttr1 || attribute === weakAttr2) {
    matchSelect.value = "weak";
  } else if (attribute === resistAttr1 || attribute === resistAttr2) {
    matchSelect.value = "resist";
  } else {
    matchSelect.value = "none";
  }

  updateAttrMatchPct();
}

// ---------------- Agent Info ----------------
function updateAgentInfo(dict = {}) {
  const sel = $("agentSelect")?.value;
  const agent = agents[sel] || {};

  updateText("faction", t(dict, `faction.${agent.factionId}`, agent.factionId));
  updateText("specialty", t(dict, `specialty.${agent.specialtyId}`, agent.specialtyId));
  updateText("attribute", t(dict, `attribute.${agent.attributeId}`, agent.attributeId));

  updateIcon("faction", agent.factionId, paths.faction, t(dict, "ui.factionLabel", "Faction"));
  updateIcon("specialty", agent.specialtyId, paths.specialty, t(dict, "ui.specialtyLabel", "Specialty"));
  updateIcon("attribute", agent.attributeId, paths.attribute, t(dict, "ui.attributeLabel", "Attribute"));

  $("attrSelect").value = attributeValueMap[agent.attributeId] ?? "";
  updateAnomalyCorr();

  updateImage("agentImage", agent.image ? paths.agent + agent.image : "", agent.image ? `画像:${t(dict, `agent.${sel}`, sel)}` : "");
  updateImage("rankImage", agent.rank ? `${paths.rank}rank_${agent.rank}.png` : "", agent.rank ? `ランク${agent.rank}` : "");
  updateLink("agentLink", agent.link ? urls.hoyowiki + agent.link : "");
}

// ---------------- Enemy Info ----------------
function updateEnemyInfo(dict = {}) {
  const sel = $("enemySelect")?.value;
  const enemy = enemies[sel] || {};

  updateAttrGroup(enemy.weakAttrId || [], "weakAttr", dict);
  updateAttrGroup(enemy.resistAttrId || [], "resistAttr", dict);

  updateImage("enemyImage", enemy.image ? paths.enemy + enemy.image : "", enemy.image ? `画像:${t(dict, `enemy.${sel}`, sel)}` : "");
  updateLink("enemyLink", enemy.link ? urls.hoyowiki + enemy.link : "");
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
const updateWeakRange = () => setValue("weakRangePct", rangeTable[$("rangeSelect")?.value] ?? 100);
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
  const weakRangeMul = percent.toMul(v.weakRangePct - 100);

  const defEff = v.def * (1 + percent.toFrac(v.defUpPct) - percent.toFrac(v.defDownPct));
  const defValid = defEff * (1 - percent.toFrac(v.penRatioPct)) - v.pen;
  const defMul = v.lvCoeff / Math.max(1e-9, (v.lvCoeff + Math.max(0, defValid)));

  const resistMul = 1
    - percent.toFrac(v.attrMatchPct)
    + percent.toFrac(v.attrResiDownPct)
    + percent.toFrac(v.attrResiIgnorePct);

  const computeFn = (mode === "mode--normal") ? computeNormal : computeAnomaly;
  if (mode === "mode--normal") {
    computeFn(v, digits, totalBonus, breakBonusMul, weakRangeMul, defMul, resistMul, setText);
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
function applyDefaults(force = false) {
  fields.forEach(k => {
    const el = $(k);
    if (!el) return;
    if (force || el.value === "" || el.value == null) {
      setElementValue(el, defaults[k]);
    }
  });

  updateAgentInfo(i18nDict);
  updateEnemyInfo(i18nDict);
  updateVisibilityByMode();
  updateAnomalyCorr();
  updateWeakRange();
  updateAttrMatchPct();
  updateBreakControls();
}

function resetAll() {
  Object.entries(selectMapping).forEach(([key, id]) => {
    if (key === "langSelect") return;
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
    loadJSON("./json/agents.json", agents, () => populateSelect("agentSelect", agents, i18nDict)),
    loadJSON("./json/enemies.json", enemies, () => populateSelect("enemySelect", enemies, i18nDict)),
    loadJSON("./json/lvCoeffTable.json", lvCoeffTable),
    loadJSON("./json/helpTexts.json", helpTexts),
    loadJSON(`./json/lang/${$("langSelect").value || "jp"}.json`, i18nDict, dict => applyLanguage(dict))
  ]);
}

// ---------------- Select生成 ----------------
function populateSelect(id, data, dict = {}) {
  const select = $(id);
  if (!select) return;

  const currentValue = select.value;

  const label = t(dict, "ui.selectPrompt", "-- Select --");
  const prefix =
    id === "agentSelect" ? "agent" :
      id === "enemySelect" ? "enemy" :
        id; // fallback

  select.innerHTML = [
    `<option value="">${label}</option>`,
    ...Object.keys(data).map(key =>
      `<option value="${key}">${t(dict, `${prefix}.${key}`, key)}</option>`
    )
  ].join("");

  if (currentValue && data[currentValue]) {
    select.value = currentValue;
  }
}

// 共通: 値を要素にセット
function setElementValue(el, value) {
  if (!el) return;
  if (el.type === "checkbox" || el.type === "radio") {
    el.checked = !!value;
  } else {
    el.value = value;
  }
}

// 共通: 要素から値を取得
function getElementValue(el) {
  if (!el) return undefined;
  if (el.type === "checkbox" || el.type === "radio") {
    return el.checked;
  }
  return el.value;
}

function getLabelValue(labels) {
  const lang = $("langSelect")?.value || "jp";
  return labels[lang] || labels.jp;
}

async function loadLanguage() {
  const lang = $("langSelect")?.value || "jp";
  await loadJSON(`./json/lang/${$("langSelect").value || "jp"}.json`, i18nDict, dict => applyLanguage(dict));
}

// ---------------- Local Storage ----------------
function saveToLocalStorage() {
  const params = {
    lang: $("langSelect")?.value,
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
    params[key] = getElementValue(el);;
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
      setElementValue($(id), params[key]);
    }
  });

  numericKeys.forEach(key => {
    if (params[key] !== undefined) {
      setElementValue($(key), params[key]);
    }
  });
}

function clearSavedParams() {
  localStorage.removeItem("lastParams");
  console.log("保存データを削除しました");
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

  const labels = {
    jp: "更新日: ",
    en: "Last Modified: "
  }
  const label = getLabelValue(labels);
  el.textContent = `${label}${y}/${m}/${day}`;
}

// ---------------- Event binding ----------------
function bindEvents() {
  // 入力フィールド
  ["input", "change"].forEach(type => {
    fields.forEach(id => $(id)?.addEventListener(type, compute));
  });

  // セレクト系は共通ハンドラでまとめる
  const bindChange = (id, handler) => $(id)?.addEventListener("change", () => { handler(); compute(); });

  bindChange("langSelect", async () => {
    await loadLanguage();

    populateSelect("agentSelect", agents, i18nDict);
    populateSelect("enemySelect", enemies, i18nDict);
    updateAgentInfo(i18nDict);

    loadLastModified();
    localStorage.setItem("lang", $("langSelect").value);
  });

  bindChange("attrSelect", updateAnomalyCorr);
  bindChange("rangeSelect", updateWeakRange);
  bindChange("matchSelect", updateAttrMatchPct);
  bindChange("agentSelect", () => {
    updateAgentInfo(i18nDict);
    updateMatchSelect();
  });
  bindChange("enemySelect", () => {
    updateEnemyInfo(i18nDict);
    updateMatchSelect();
  });

  qa('input[name="calcMode"]').forEach(el =>
    el.addEventListener("change", () => { updateVisibilityByMode(); compute(); })
  );

  $("breakToggle")?.addEventListener("change", () => { updateBreakControls(); compute(); });
  $("resetBtn")?.addEventListener("click", e => { e.preventDefault(); resetAll(); });

  // 共通ポップアップ制御
  const popup = $("infoPopup");
  const popupText = $("popupText");

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
  loadFromLocalStorage();
  await loadLanguage();
  await loadAllData();
  loadLastModified();

  applyDefaults();
  updateAgentInfo(i18nDict);
  updateEnemyInfo(i18nDict);
  updateVisibilityByMode();
  updateBreakControls();

  bindEvents();
  bindCopyButtons();
  initResultFixedObserver();

  compute();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
