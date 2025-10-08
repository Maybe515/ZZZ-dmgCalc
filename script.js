(() => {
  // ---------------- Utilities ----------------
  const $ = (id) => document.getElementById(id);
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getNum = (id, fallback = 0) => {
    const el = $(id);
    const v = Number(el?.value);
    return Number.isFinite(v) ? v : fallback;
  };

  const setEl = (id, prop, value) => {
    const el = $(id);
    if (el) el[prop] = value;
  };
  const setText = (id, value) => setEl(id, "textContent", value);
  const setValue = (id, value) => setEl(id, "value", value);

  const percent = {
    toMul: (p) => 1 + p / 100,
    toFrac: (p) => p / 100
  };

  const fmt = (v, d) => Number.isFinite(v) ? Number(v).toFixed(d) : "-";

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

  const defaults = {
    agentLevel: 60, lvCorrPct: 200, atk: 1500, anomalyMastery: 100, penRatioPct: 0, pen: 0,
    critRatePct: 5, critDmgPct: 50,
    attrBonusPct: 0, dmgBonusPct: 0, dmgBonusPtPct: 0,
    skillPct: 240, anomalyCorrPct: 713, rangeWeakPct: 100,
    enemLevel: 60, lvCoeff: 794, def: 571.7,
    defUpPct: 0, defDownPct: 0, attrMatchPct: 0, attrResiDownPct: 0, attrResiIgnorePct: 0,
    breakBonusPct: 100,
    digits: 0
  };

  const anomalyCorrTable = {
    physical: 713, electric: 1250, fire: 1000, ice: 500, ether: 1250, frost: 500, auric_ink: 1250
  };

  const rangeTable = { "0-15": 100, "16-20": 75, "21-25": 50, "26-": 25 };
  const matchTable = { none: 0, weak: -20, resist: 20 };

  const paths = {
    base: "assets/",
    faction: "assets/faction/",
    specialty: "assets/specialty/",
    attribute: "assets/stats/",
    agent: "assets/agent/"
  };

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

  // ---------------- Mode handling ----------------
  const getCalcMode = () => q('input[name="calcMode"]:checked')?.value || "normal";

  function updateVisibilityByMode() {
    const mode = getCalcMode();
    const toggle = (selector, activeMode) =>
      qa(selector).forEach(el => el.classList.toggle("is-disabled", mode === activeMode));
    toggle(".is-disabled-normal", "normal");
    toggle(".is-disabled-anomaly", "anomaly");

    qa(".is-hidden-anomaly").forEach(el => {
      el.style.display = (mode === "anomaly") ? "none" : "";
    });

    document.body.dataset.mode = mode;
  }

  // ---------------- Icon/text binding ----------------
  function updateFieldWithIcon(id, value, iconPath, iconMap, altPrefix = "") {
    setText(id, value || "-");
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

  function updateAgentInfo() {
    const sel = $("agentSelect")?.value;
    const agent = agents[sel] || {};

    ["faction", "specialty", "attribute"].forEach(key => {
      const el = $(key);
      el.textContent = agent[key] || "-";
      el.title = el.textContent;
    });

    updateFieldWithIcon("faction", agent.faction, paths.faction, factionIcons, "陣営");
    updateFieldWithIcon("specialty", agent.specialty, paths.specialty, specialtyIcons, "役割");
    updateFieldWithIcon("attribute", agent.attribute, paths.attribute, attributeIcons, "属性");


    const attrSelect = $("attrSelect");
    if (attrSelect) {
      attrSelect.value = attributeValueMap[agent.attribute] ?? "";
      updateAnomalyCorr();
    }

    const agentEl = $("agentImage");
    if (agentEl) {
      agentEl.src = agent.image ? paths.agent + agent.image : "";
      agentEl.alt = agent.image ? `画像:${sel}` : "";
    }

    const rankEl = $("rankImage");
    if (rankEl) {
      rankEl.src = agent.rank ? `${paths.base}rank_${agent.rank}.png` : "";
      rankEl.alt = agent.rank ? `ランク${agent.rank}` : "";
    }
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
  function computeNormal(v, digits, totalBonus, breakBonusMul, rangeWeakMul, defMul, resistMul) {
    const base = v.atk * percent.toFrac(v.skillPct);
    const critMul = 1 + percent.toFrac(v.critDmgPct);
    const expCritMul = 1 + percent.toFrac(v.critRatePct) * percent.toFrac(v.critDmgPct);
    const dmgFn = (mul) => base * totalBonus * mul * breakBonusMul * rangeWeakMul * defMul * resistMul;

    setText("base", fmt(base, digits));
    setText("nonCritMul", fmt(1, digits + 2));
    setText("critMul", fmt(critMul, digits + 2));
    setText("expCritMul", fmt(expCritMul, digits + 2));
    setText("nonCrit", fmt(dmgFn(1), digits));
    setText("crit", fmt(dmgFn(critMul), digits));
    setText("expected", fmt(dmgFn(expCritMul), digits));
  }

  function computeAnomaly(v, digits, totalBonus, breakBonusMul, defMul, resistMul) {
    const anomaly = v.anomalyMastery / 100;
    const lvCorrMul = percent.toMul(v.lvCorrPct);
    const anomalyMul = percent.toMul(v.anomalyCorrPct);
    const dmgFn = (mul) => v.atk * totalBonus * mul * breakBonusMul * anomaly * lvCorrMul * anomalyMul * defMul * resistMul;

    setText("base", fmt(v.atk, digits));
    setText("nonCritMul", "-");
    setText("critMul", "-");
    setText("expCritMul", "-");
    setText("expected", fmt(dmgFn(1), digits));
  }

  function compute() {
    const mode = getCalcMode();
    const v = Object.fromEntries(fields.map(k => [k, getNum(k, defaults[k])]));
    const digits = Math.max(0, Math.min(6, v.digits));

    const totalBonus = 1
      + percent.toFrac(v.attrBonusPct)
      + percent.toFrac(v.dmgBonusPct)
      + percent.toFrac(v.dmgBonusPtPct);

    const breakBonusMul = breakToggle?.checked ? percent.toMul(v.breakBonusPct) : 1.0;
    const rangeWeakMul = percent.toMul(v.rangeWeakPct - 100);

    const defEff = v.def * (1 + percent.toFrac(v.defUpPct) - percent.toFrac(v.defDownPct));
    const defValid = defEff * (1 - percent.toFrac(v.penRatioPct)) - v.pen;
    const defMul = v.lvCoeff / Math.max(1e-9, (v.lvCoeff + Math.max(0, defValid)));

    const resistMul = 1
      - percent.toFrac(v.attrMatchPct)
      + percent.toFrac(v.attrResiDownPct)
      + percent.toFrac(v.attrResiIgnorePct);

    if (mode === "normal") {
      computeNormal(v, digits, totalBonus, breakBonusMul, rangeWeakMul, defMul, resistMul);
    } else {
      computeAnomaly(v, digits, totalBonus, breakBonusMul, defMul, resistMul);
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

  // ---------------- Select population ----------------
  function populateSelect(id, data) {
    const select = $(id);
    if (!select) return;
    const options = [`<option value="">-- 選択してください --</option>`]
      .concat(Object.keys(data).map(name => `<option value="${name}">${name}</option>`));
    select.innerHTML = options.join("");
  }

  // ---------------- Event binding ----------------
  function bindEvents() {
    // Recompute on input/change for numeric fields
    ["input", "change"].forEach(type => {
      fields.forEach(id => {
        const el = $(id);
        if (el) el.addEventListener(type, compute);
      });
    });

    // Derived field updates
    $("attrSelect")?.addEventListener("change", () => { updateAnomalyCorr(); compute(); });
    $("rangeSelect")?.addEventListener("change", () => { updateRangeWeak(); compute(); });
    $("matchSelect")?.addEventListener("change", () => { updateAttrMatchPct(); compute(); });

    // Agent selection
    $("agentSelect")?.addEventListener("change", () => { updateAgentInfo(); compute(); });

    // Enemy selection
    $("enemSelect")?.addEventListener("change", () => {
      const enem = enemies[$("enemSelect").value] || {};
      updateFieldWithIcon("attrWeak", enem.attrWeak || "", null, null);
      updateFieldWithIcon("attrResist", enem.attrResist || "", null, null);
      compute();
    });

    // Agent level sync
    $("agentLevel")?.addEventListener("input", () => {
      const level = Number($("agentLevel")?.value ?? defaults.agentLevel);
      const corrMulPct = (1 + 0.016949 * (level - 1)) * 100;
      setValue("lvCorrPct", fmt(corrMulPct, 2));
      setValue("lvCoeff", lvCoeffTable[level] ?? defaults.lvCoeff);
      compute();
    });

    // Mode change
    qa('input[name="calcMode"]').forEach(el =>
      el.addEventListener("change", () => { updateVisibilityByMode(); compute(); })
    );

    // Break toggle
    $("breakToggle")?.addEventListener("change", () => { updateBreakControls(); compute(); });

    // Reset
    $("resetBtn")?.addEventListener("click", (e) => { e.preventDefault(); resetAll(); });

    // Observe Result
    const resultSection = document.querySelector(".result");           // 通常表示
    const resultFixed = document.querySelector(".result--fixed");      // 固定表示

    function syncResultContent() {
      resultFixed.innerHTML = resultSection.innerHTML;
    }

    const observer = new MutationObserver(syncResultContent);
    observer.observe(resultSection, {
      childList: true,       // 子要素の追加・削除
      subtree: true,         // ネストした要素を監視
      characterData: true    // テキスト変更も監視
    });

    syncResultContent();

    function toggleResultFixed() {
      if (window.innerWidth <= 1000) {
        const rect = resultSection.getBoundingClientRect();
        const triggerOffset = -20;
        const isVisible = rect.top < window.innerHeight - triggerOffset && rect.bottom > 0;

        if (isVisible) {
          resultFixed.classList.remove("is-visible"); // 非表示
        } else {
          resultFixed.classList.add("is-visible");    // フェードイン表示
        }
      } else {
        resultFixed.classList.remove("is-visible");   // PC表示では非表示
      }
    }

    window.addEventListener("scroll", toggleResultFixed);
    window.addEventListener("resize", toggleResultFixed);
    toggleResultFixed();
  }

  function bindCopyEvents() {
    document.addEventListener("click", async (e) => {
      const card = e.target.closest(".result__card");
      if (!card) return;

      const valueEl = card.querySelector(".result__value");
      if (!valueEl) return;

      const value = valueEl.textContent.trim();
      if (!value || value === "-") return;

      try {
        await navigator.clipboard.writeText(value);
        showToast(); // 既存のトースト通知を利用
      } catch (err) {
        console.error("コピーに失敗しました:", err);
        showToast("コピーに失敗しました");
      }
    });

    const toast = document.getElementById('toast');
    function showToast() {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1500);
    }
  }
  // ---------------- Init ----------------
  async function init() {
    await loadAllData();
    applyDefaults();
    updateAgentInfo();
    updateVisibilityByMode();
    updateAnomalyCorr();
    updateRangeWeak();
    updateAttrMatchPct();
    updateBreakControls();
    bindEvents();
    bindCopyEvents();
    compute();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
