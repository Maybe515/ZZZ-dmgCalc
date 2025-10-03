(() => {
  // ---------------- Utilities ----------------
  const $ = (id) => document.getElementById(id);
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getNum = (id, fallback = 0) => {
    const el = $(id);
    if (!el) return fallback;
    const v = Number(el.value);
    return Number.isFinite(v) ? v : fallback;
  };
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value; };
  const setValue = (id, value) => { const el = $(id); if (el) el.value = value; };

  const pctToMul = (p) => 1 + p / 100;
  const pctToFrac = (p) => p / 100;
  const fmt = (v, d) => Number.isFinite(v) ? Number(v).toFixed(d) : "-";

  // ---------------- Data ----------------
  const agents = {};
  const enemies = {};
  const lvCoeffTable = {};

  // NOTE: penRatioPct: ensure consistent naming across HTML/JS (fix typo from penRetioPct)
  const fields = [
    "agentLevel", "lvCorrPct", "atk", "anomalyMastery", "penRatioPct", "pen",
    "critRatePct", "critDmgPct",
    "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
    "skillPct", "anomalyCorrPct", "breakBonusPct", "rangeWeakPct",
    "enemLevel", "lvCoeff", "def", "defUpPct", "defDownPct",
    "attrMatchPct", "attrResiDownPct", "attrResiIgnorePct",
    "digits"
  ];

  const defaults = {
    agentLevel: 60, lvCorrPct: 200, atk: 1500, anomalyMastery: 100, penRatioPct: 0, pen: 0,
    critRatePct: 5, critDmgPct: 50,
    attrBonusPct: 0, dmgBonusPct: 0, dmgBonusPtPct: 0,
    skillPct: 240, anomalyCorrPct: 713, breakBonusPct: 0, rangeWeakPct: 100,
    enemLevel: 60, lvCoeff: 794, def: 571.7, defUpPct: 0, defDownPct: 0,
    attrMatchPct: 0, attrResiDownPct: 0, attrResiIgnorePct: 0,
    digits: 0
  };

  const anomalyCorrTable = {
    physical: 713, electric: 1250, fire: 1000, ice: 500, ether: 1250, frost: 500, auric_ink: 1250
  };

  const rangeTable = { "0-15": 100, "16-20": 75, "21-25": 50, "26-": 25 };

  const matchTable = { none: 0, weak: -20, resist: 20 };

  const factionIconPath = "assets/faction/";
  const specialtyIconPath = "assets/specialty/";
  const attributeIconPath = "assets/stats/";
  const agentIgamePath = "assets/agent/";

  const factionIcons = {
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

  const specialtyIcons = {
    "強攻": "attack.webp",
    "撃破": "stun.webp",
    "支援": "support.webp",
    "異常": "anomaly.webp",
    "防護": "defense.webp",
    "命破": "rupture.webp"
  };

  const attributeIcons = {
    "物理": "physical.webp",
    "電気": "electric.webp",
    "炎": "fire.webp",
    "氷": "ice.webp",
    "エーテル": "ether.webp",
    "霜烈": "frost.webp",
    "玄墨": "auric_ink.webp"
  };

  const attributeValueMap = {
    "物理": "physical",
    "電気": "electric",
    "炎": "fire",
    "氷": "ice",
    "エーテル": "ether",
    "霜烈": "frost",
    "玄墨": "auric_ink"
  };

  // ---------------- Mode handling (BEM utilities) ----------------
  const getCalcMode = () => q('input[name="calcMode"]:checked')?.value || "normal";

  function updateVisibilityByMode() {
    const mode = getCalcMode();

    const toggle = (selector, activeMode) => {
      qa(selector).forEach(el => {
        el.classList.toggle("is-disabled", mode === activeMode);
      });
    };

    // These selectors should match BEM-based HTML classes you applied
    toggle(".is-disabled-normal", "normal");
    toggle(".is-disabled-anomaly", "anomaly");
  }

  // ---------------- Icon/text binding ----------------
  function updateFieldWithIcon(id, value, iconPath, iconMap, altPrefix = "") {
    let Element;

    if (id === "agentImage") {
      Element = $(id);
    } else {
      setText(id, value || "-");
      Element = $(id + "Icon");
    }

    if (!Element) return;
    if (value && iconMap[value]) {
      Element.src = iconPath + iconMap[value];
      Element.alt = altPrefix ? `${altPrefix}: ${value}` : value;
    } else {
      Element.src = "";
      Element.alt = "";
    }
  }

  function updateAgentInfo() {
    const sel = $("agentSelect")?.value;
    const agent = agents[sel] || null;

    const faction = agent?.faction || "";
    const specialty = agent?.specialty || "";
    const attribute = agent?.attribute || "";
    const image = agent?.image || "";

    updateFieldWithIcon("faction", faction, factionIconPath, factionIcons, "陣営");
    updateFieldWithIcon("specialty", specialty, specialtyIconPath, specialtyIcons, "役割");
    updateFieldWithIcon("attribute", attribute, attributeIconPath, attributeIcons, "属性");
    updateFieldWithIcon("agentImage", image, agentIgamePath, image, "画像");

    const imgEl = $("agentImage");
    if (!imgEl) return;
    if (image) {
      imgEl.src = agentIgamePath + image || "";
      imgEl.alt = "画像:" + sel || "";
    } else {
      imgEl.src = "";
      imgEl.alt = "";
    }
  }

  // ---------------- Derived field updates ----------------
  function updateAnomalyCorr() {
    const selectedAttrKey = $("attrSelect")?.value; // physical, electric, ...
    const corr = anomalyCorrTable[selectedAttrKey];
    setValue("anomalyCorrPct", Number.isFinite(corr) ? corr : 0);
  }

  function updateRangeWeak() {
    const v = $("rangeSelect")?.value;
    const pct = rangeTable[v];
    setValue("rangeWeakPct", Number.isFinite(pct) ? pct : 100);
  }

  function updateAttrMatchPct() {
    const v = $("matchSelect")?.value;
    const pct = matchTable[v];
    setValue("attrMatchPct", Number.isFinite(pct) ? pct : 0);
  }

  // ---------------- Break controls ----------------
  const breakToggle = $("breakToggle");
  const breakControls = $("breakControls");

  function updateBreakControls() {
    const enabled = !!breakToggle?.checked;
    breakControls?.classList.toggle("is-disabled", !enabled);
  }

  // ---------------- Compute ----------------
  function compute() {
    const mode = getCalcMode();
    const v = Object.fromEntries(fields.map(k => [k, getNum(k, defaults[k])]));
    const digits = Math.max(0, Math.min(6, v.digits));

    const base = v.atk * pctToFrac(v.skillPct);
    const critMul = 1 + pctToFrac(v.critDmgPct);
    const expCritMul = 1 + pctToFrac(v.critRatePct) * pctToFrac(v.critDmgPct);

    const totalBonus = 1
      + pctToFrac(v.attrBonusPct)
      + pctToFrac(v.dmgBonusPct)
      + pctToFrac(v.dmgBonusPtPct);

    const breakBonusMul = breakToggle?.checked ? pctToMul(v.breakBonusPct) : 1.0;
    const rangeWeakMul = pctToMul(v.rangeWeakPct - 100); // convert 100% baseline to 1.0
    // Alternatively, if rangeWeakPct already represents multiplier (e.g., 100 -> 1.0), use:
    // const rangeWeakMul = pctToFrac(v.rangeWeakPct);

    const defEff = v.def * (1 + pctToFrac(v.defUpPct) - pctToFrac(v.defDownPct));
    const defValid = defEff * (1 - pctToFrac(v.penRatioPct)) - v.pen;
    const defMul = v.lvCoeff / Math.max(1e-9, (v.lvCoeff + Math.max(0, defValid)));

    const resistMul = 1
      - pctToFrac(v.attrMatchPct)
      + pctToFrac(v.attrResiDownPct)
      + pctToFrac(v.attrResiIgnorePct);

    let dmgFn;
    if (mode === "normal") {
      dmgFn = (mul) => base * totalBonus * mul * breakBonusMul * rangeWeakMul * defMul * resistMul;

      setText("base", fmt(base, digits));
      setText("nonCritMul", fmt(1, digits + 2));
      setText("critMul", fmt(critMul, digits + 2));
      setText("expCritMul", fmt(expCritMul, digits + 2));
      setText("nonCrit", fmt(dmgFn(1), digits));
      setText("crit", fmt(dmgFn(critMul), digits));
      setText("expected", fmt(dmgFn(expCritMul), digits));
    } else {
      const anomaly = v.anomalyMastery / 100;
      const lvCorrMul = pctToMul(v.lvCorrPct);
      const anomalyMul = pctToMul(v.anomalyCorrPct);

      dmgFn = (mul) => v.atk * totalBonus * mul * breakBonusMul * anomaly * lvCorrMul * anomalyMul * defMul * resistMul;

      setText("base", fmt(v.atk, digits));
      setText("nonCritMul", "-");
      setText("critMul", "-");
      setText("expCritMul", "-");
      setText("expected", fmt(dmgFn(1), digits));
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
    // Derived defaults
    updateAnomalyCorr();
    updateRangeWeak();
    updateAttrMatchPct();
    updateBreakControls();
  }

  function resetAll() {
    applyDefaults(true);
    compute();
  }

  // ---------------- Theme toggle ----------------
  function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.contains("theme-light");
    body.classList.toggle("theme-light", !isLight);
    body.classList.toggle("theme-dark", isLight);
  }

  // ---------------- Event binding ----------------
  function bindEvents() {
    // Mode change
    qa('input[name="calcMode"]').forEach(el => {
      el.addEventListener("change", () => {
        updateVisibilityByMode();
        compute();
      });
    });

    // Inputs recompute
    const recomputeHandlers = [
      "input", "change"
    ];
    recomputeHandlers.forEach(type => {
      fields.forEach(id => {
        const el = $(id);
        if (el) el.addEventListener(type, compute);
      });
    });

    // Derived selectors
    $("attrSelect")?.addEventListener("change", () => { updateAnomalyCorr(); compute(); });
    $("rangeSelect")?.addEventListener("change", () => { updateRangeWeak(); compute(); });
    $("matchSelect")?.addEventListener("change", () => { updateAttrMatchPct(); compute(); });

    // Break toggle
    breakToggle?.addEventListener("change", () => { updateBreakControls(); compute(); });

    // Agent select
    $("agentSelect")?.addEventListener("change", () => { updateAgentInfo(); compute(); });

    // Reset
    $("resetBtn")?.addEventListener("click", (e) => { e.preventDefault(); resetAll(); });

    // Theme
    $("toggleTheme")?.addEventListener("click", (e) => { e.preventDefault(); toggleTheme(); });
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

  // Example loaders (paths to be adjusted as needed)
  async function loadAllData() {
    await Promise.all([
      // loadJSON("./data/agents.json", agents, populateagentSelect),
      // loadJSON("./data/enemies.json", enemies, populateEnemySelect),
      // loadJSON("./data/lv_coeff.json", lvCoeffTable, () => {/* optional post-load */})
    ]);
  }

  function populateagentSelect() {
    const sel = $("agentSelect");
    if (!sel) return;
    sel.innerHTML = `<option value=""></option>` +
      Object.keys(agents).map(k => `<option value="${k}">${k}</option>`).join("");
  }

  function populateEnemySelect() {
    const sel = $("enemSelect");
    if (!sel) return;
    sel.innerHTML = `<option value=""></option>` +
      Object.keys(enemies).map(k => `<option value="${k}">${k}</option>`).join("");
  }

  // ---------------- Init ----------------
  function init() {
    applyDefaults();
    updateAgentInfo();
    updateVisibilityByMode();
    bindEvents();
    compute();
    // loadAllData(); // Uncomment and implement data sources when available
  }

  // ---------------- Select population ----------------
  function populateSelect(id, data) {
    const select = $(id);
    if (!select) return;
    const options = [`<option value="">-- 選択してください --</option>`]
      .concat(Object.keys(data).map(name => `<option value="${name}">${name}</option>`));
    select.innerHTML = options.join("");
  }

  // ---------------- Field update (icon-aware) ----------------
  // Prefer updateFieldWithIcon from previous part for icon-capable fields.
  function updateField(id, value, iconPath, iconMap) {
    setText(id, value || "-");
    const Element = $(id + "Icon");
    if (!Element) return;
    if (value && iconMap && iconMap[value]) {
      Element.src = iconPath + iconMap[value];
      Element.alt = value || "";
    } else {
      Element.src = "";
      Element.alt = "";
    }
  }

  // ---------------- Event binding (refactored) ----------------
  function bindEvents() {
    // Recompute on input/change for numeric fields
    const recomputeEvents = ["input", "change"];
    fields.forEach(id => {
      const el = $(id);
      if (!el) return;
      recomputeEvents.forEach(type => el.addEventListener(type, compute));
    });

    // Reset to defaults
    $("resetBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      resetAll();
    });

    // Derived field updates
    $("attrSelect")?.addEventListener("change", () => { updateAnomalyCorr(); compute(); });
    $("rangeSelect")?.addEventListener("change", () => { updateRangeWeak(); compute(); });
    $("matchSelect")?.addEventListener("change", () => { updateAttrMatchPct(); compute(); });

    // Agent selection and dependent updates
    $("agentSelect")?.addEventListener("change", () => {
      const sel = $("agentSelect").value;
      const agent = agents[sel] || null;

      // Update agent info
      updateFieldWithIcon("faction", agent?.faction || "", factionIconPath, factionIcons, "陣営");
      updateFieldWithIcon("specialty", agent?.specialty || "", specialtyIconPath, specialtyIcons, "役割");
      updateFieldWithIcon("attribute", agent?.attribute || "", attributeIconPath, attributeIcons, "属性");
      updateFieldWithIcon("agentImage", agent?.image || "", agentIgamePath, agent.image, "画像");

      const imgEl = $("agentImage");
      if (imgEl) {
        if (agent?.image) {
          imgEl.src = agentIgamePath + agent?.image || "";
          imgEl.alt = "画像:" + sel || "";
        } else {
          imgEl.src = "";
          imgEl.alt = "";
        }
      }

      // Sync anomaly attribute select from agent attribute
      const attrValue = agent?.attribute ? attributeValueMap[agent.attribute] : "";
      if (attrValue) {
        setValue("attrSelect", attrValue);
        updateAnomalyCorr();
      }
      compute();
    });

    // Enemy selection
    $("enemSelect")?.addEventListener("change", () => {
      const sel = $("enemSelect").value;
      const enem = enemies[sel] || null;
      updateField("attrWeak", enem?.attrWeak || "", null, null);
      updateField("attrResist", enem?.attrResist || "", null, null);
      compute();
    });

    // agent level: lvCorrPct and lvCoeff sync
    $("agentLevel")?.addEventListener("input", () => {
      const level = Number($("agentLevel")?.value ?? defaults.agentLevel);
      const corrMulPct = (1 + 0.016949 * (level - 1)) * 100;
      const corr = fmt(corrMulPct, 2);
      setValue("lvCorrPct", corr);

      const coeff = lvCoeffTable[level];
      setValue("lvCoeff", Number.isFinite(coeff) ? coeff : defaults.lvCoeff);
      compute();
    });

    // Mode change updates visibility and recalculates
    qa('input[name="calcMode"]').forEach(el => {
      el.addEventListener("change", () => {
        updateVisibilityByMode();
        compute();
      });
    });

    // Break toggle
    $("breakToggle")?.addEventListener("change", () => {
      updateBreakControls();
      compute();
    });

    // Theme preference management
    const KEY = "theme-preference"; // 'light' | 'dark'
    const body = document.body;
    const btn = $("toggleTheme");
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (pref) => {
      body.classList.remove("theme-light", "theme-dark");
      if (pref) body.classList.add(`theme-${pref}`);
    };
    const getPref = () => localStorage.getItem(KEY);
    const setPref = (pref) => { localStorage.setItem(KEY, pref); applyTheme(pref); };

    // Initial theme
    const saved = getPref();
    applyTheme(saved || (media.matches ? "dark" : "light"));

    // Follow OS changes when no saved preference
    media.addEventListener("change", () => {
      if (!getPref()) applyTheme(media.matches ? "dark" : "light");
    });

    // Button toggle
    btn?.addEventListener("click", (e) => {
      e.preventDefault();
      const curr = getPref() || (media.matches ? "dark" : "light");
      const next = curr === "light" ? "dark" : "light";
      setPref(next);
      btn.textContent = next === "light" ? "☀ ライト" : "🌙 ダーク";
    });

    // Initial button label
    if (btn) {
      const curr = saved || (media.matches ? "dark" : "light");
      btn.textContent = curr === "light" ? "☀ ライト" : "🌙 ダーク";
    }
  }

  // ---------------- Init (refactored) ----------------
  async function init() {
    // Load data then populate selects
    await Promise.all([
      loadJSON("./json/agents.json", agents, () => populateSelect("agentSelect", agents)),
      loadJSON("./json/enemies.json", enemies, () => populateSelect("enemSelect", enemies)),
      loadJSON("./json/lvCoeffTable.json", lvCoeffTable)
    ]);

    applyDefaults();          // apply default values and derived ones
    bindEvents();             // attach handlers
    updateVisibilityByMode(); // set initial visibility per mode
    updateAnomalyCorr();      // derive anomaly corr from current attrSelect
    updateRangeWeak();        // derive rangeWeakPct from rangeSelect
    updateAttrMatchPct();     // derive attrMatchPct from matchSelect
    updateBreakControls();    // sync disabled state
    compute();                // initial compute
  }

  document.addEventListener("DOMContentLoaded", init);
})();
