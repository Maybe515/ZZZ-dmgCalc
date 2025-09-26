(() => {
  // 🔹 DOMユーティリティ
  const $ = (id) => document.getElementById(id);
  const getNum = (id, fallback = 0) => Number($(id)?.value) || fallback;
  const setText = (id, value) => $(id).textContent = value;
  const setValue = (id, value) => $(id).value = value;

  // 🔹 数値変換
  const pctToMul = (p) => 1 + p / 100;
  const pctToFrac = (p) => p / 100;
  const fmt = (v, d) => isFinite(v) ? Number(v).toFixed(d) : "-";

  // 🔹 データ定義
  let characters = {}, enemies = {}, lvCoeffTable = {};

  const fields = [
    "playerLevel", "lvCorrPct", "atk", "anomalyMastery", "penRatioPct", "pen",
    "critRatePct", "critDmgPct",
    "attrBonusPct", "dmgBonusPct", "dmgBonusPtPct",
    "skillPct", "anomalyCorrPct", "breakBonusPct", "rangeWeakPct",
    "enemLevel", "lvCoeff", "def", "defUpPct", "defDownPct",
    "attrMatchPct", "attrResiDownPct", "attrResiIgnorePct",
    "digits"
  ];

  const defaults = {
    playerLevel: 60, lvCorrPct: 200 , atk: 1500, anomalyMastery: 100, penRatioPct: 0, pen: 0,
    critRatePct: 5, critDmgPct: 50,
    attrBonusPct: 0, dmgBonusPct: 0, dmgBonusPtPct: 0,
    skillPct: 240, anomalyCorrPct: 713, breakBonusPct: 0, rangeWeakPct: 40,
    enemLevel: 60, lvCoeff: 794, def: 571.7, defUpPct: 0, defDownPct: 0, 
    attrMatchPct: 0, attrResiDownPct: 0, attrResiIgnorePct: 0,
    digits: 0
  };

  const anomalyCorrTable = {
    "physical": 713, "electric": 1250, "fire": 1000, "ice": 500, "ether": 1250, "frost": 500, "auric_ink": 1250
  };

  const rangeTable = {
    "0-15": 100, "20": 75, "25": 50, "30-": 25
  };

  const matchTable = {
    "none": 0, "weak": -20, "resist": 20
  };

  const factionIcons = {
    "邪兎屋": "assets/faction/cunning_hares.webp",
    "白祇重工": "assets/faction/belobog_heavy_industries.webp",
    "ヴィクトリア家政": "assets/faction/victoria.webp",
    "オボルス小隊": "assets/faction/obol_squad.webp",
    "カリュドーンの子": "assets/faction/sons_of_calydon.webp",
    "対ホロウ特別行動部第六課": "assets/faction/hsos6.webp",
    "特務捜査班": "assets/faction/neps.webp",
    "スターズ・オブ・リラ": "assets/faction/stars_of_lyra.webp",
    "防衛軍・シルバー小隊": "assets/faction/silver_squad.webp",
    "モッキンバード": "assets/faction/mockingbird.webp",
    "雲嶽山": "assets/faction/yunkui_summit.webp",
    "怪啖屋": "assets/faction/spook_shack.webp",
  };

  const specialtyIcons = {
    "強攻": "assets/specialty/attack.webp",
    "撃破": "assets/specialty/stun.webp",
    "支援": "assets/specialty/support.webp",
    "異常": "assets/specialty/anomaly.webp",
    "防護": "assets/specialty/defense.webp",
    "命破": "assets/specialty/rupture.webp"
  };

  const attributeIcons = {
    "物理": "assets/stats/physical.webp",
    "電気": "assets/stats/electric.webp",
    "炎": "assets/stats/fire.webp",
    "氷": "assets/stats/ice.webp",
    "エーテル": "assets/stats/ether.webp",
    "霜烈": "assets/stats/frost.webp",
    "玄墨": "assets/stats/auric_ink.webp"
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

  function getCalcMode() {
    return document.querySelector('input[name="calcMode"]:checked')?.value || "normal";
  }

  function updateVisibilityByMode() {
    const mode = getCalcMode();
    document.querySelectorAll(".hideable-normal").forEach(el => {
      el.classList.toggle("hidden", mode === "normal");
    });
    document.querySelectorAll(".hideable-anomaly").forEach(el => {
      el.classList.toggle("hidden", mode === "anomaly");
    });
  }

  function updateAnomalyCorr() {
    const selected = $("attrSelect").value;
    const corr = anomalyCorrTable[selected] ?? "-";
    setValue("anomalyCorrPct", corr);
  }

   // 🔹 計算ロジック
  function compute() {
    const mode = getCalcMode();
    const v = Object.fromEntries(fields.map(k => [k, getNum(k, defaults[k])]));
    const digits = Math.max(0, Math.min(6, v.digits));

    const base = v.atk * pctToFrac(v.skillPct);
    const critMul = 1 + pctToFrac(v.critDmgPct);
    const expCritMul = 1 + pctToFrac(v.critRatePct) * pctToFrac(v.critDmgPct);
    const totalBonus = 1 + pctToFrac(v.attrBonusPct) + pctToFrac(v.dmgBonusPct) + pctToFrac(v.dmgBonusPtPct);
    const breakBonus = pctToFrac(v.breakBonusPct);
    const rangeWeak = pctToFrac(v.rangeWeakPct);

    const defEff = v.def * (1 + pctToFrac(v.defUpPct) - pctToFrac(v.defDownPct));
    const defValid = defEff * (1 - pctToFrac(v.penRatioPct)) - v.pen;
    const defMul = v.lvCoeff / (v.lvCoeff + defValid);

    const resistMul = 1 - pctToFrac(v.attrMatchPct) + pctToFrac(v.attrResiDownPct) + pctToFrac(v.attrResiIgnorePct);

    let dmg;
    if (mode === "normal") {
      dmg = (mul) => base * totalBonus * mul * breakBonus * rangeWeak * defMul * resistMul;
      setText("base", fmt(base, digits));  
      setText("nonCritMul", fmt(1, digits + 2));
      setText("critMul", fmt(critMul, digits + 2));
      setText("expCritMul", fmt(expCritMul, digits + 2));
      setText("nonCrit", fmt(dmg(1), digits));
      setText("crit", fmt(dmg(critMul), digits));
      setText("expected", fmt(dmg(expCritMul), digits));
    } else {
      const anomaly = v.anomalyMastery / 100;
      const lvCorr = pctToFrac(v.lvCorrPct);
      const anomalyCorr = pctToFrac(v.anomalyCorrPct);
      dmg = (mul) => v.atk * totalBonus * mul * breakBonus * anomaly * lvCorr * anomalyCorr * defMul * resistMul;
      setText("base", fmt(v.atk, digits));
      setText("nonCritMul", "-");
      setText("critMul", "-");
      setText("expCritMul", "-");
      setText("expected", fmt(dmg(1), digits));
    }

    setText("totalBonus", fmt(totalBonus, digits + 2));
    setText("defMul", fmt(defMul, digits + 2));
    setText("resiMul", fmt(resistMul, digits + 2));
  }

  // 🔹 初期値適用
  function applyDefaults() {
    fields.forEach(k => {
      const el = $(k);
      if (el && !el.value) el.value = defaults[k];
    });
  }

  // 🔹 データロード汎用
  async function loadJSON(path, target, callback) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`${path} 読み込み失敗`);
      const data = await res.json();
      Object.assign(target, data);
      callback?.();
    } catch (err) {
      console.error(err);
    }
  }

  // 🔹 セレクト構築
  function populateSelect(id, data) {
    const select = $(id);
    select.innerHTML = `<option value="">-- 選択してください --</option>`;
    Object.keys(data).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  }

 function bindEvents() {
    fields.forEach(k => $(k)?.addEventListener("input", compute));

    $("resetBtn")?.addEventListener("click", () => {
      fields.forEach(k => setValue(k, defaults[k]));
      compute();
    });

    $("attrSelect")?.addEventListener("change", () => {
      updateAnomalyCorr();
      compute();
    });

    $("rangeSelect")?.addEventListener("change", () => {
      const selected = $("rangeSelect").value;
      if (rangeTable[selected] !== undefined) {
        setValue("rangeWeakPct", rangeTable[selected]);
        compute();
      }
    });

    $("matchSelect")?.addEventListener("change", () => {
      const selected = $("matchSelect").value;
      if (matchTable[selected] !== undefined) {
        setValue("attrMatchPct", matchTable[selected]);
        compute();
      }
    });

    $("charSelect")?.addEventListener("change", () => {
      const char = characters[$("charSelect").value];
      if (char) {
        setText("faction", char.faction || "-");
        setText("specialty", char.specialty || "-");
        setText("attribute", char.attribute || "-");
        $("factionIcon").src = factionIcons[char.faction] || "";
        $("factionIcon").alt = char.faction || "";
        $("specialtyIcon").src = specialtyIcons[char.specialty] || "";
        $("specialtyIcon").alt = char.specialty || "";
        $("attributeIcon").src = attributeIcons[char.attribute] || "";
        $("attributeIcon").alt = char.attribute || "";

      } else {
        setText("faction", "-");
        setText("specialty", "-");
        setText("attribute", "-");
        $("factionIcon").src = "";
        $("factionIcon").alt = "";
        $("specialtyIcon").src = "";
        $("specialtyIcon").alt = "";
        $("attributeIcon").src = "";
        $("attributeIcon").alt = "";
      }

      const attrValue = attributeValueMap[char.attribute];
      if (attrValue) {
        setValue("attrSelect", attrValue);
        updateAnomalyCorr();
      }
      compute();
    });

    $("enemSelect")?.addEventListener("change", () => {
      const enem = enemies[$("enemSelect").value];
      if (enem) {
        setText("attrWeak", enem.attrWeak || "-");
        setText("attrResist", enem.attrResist || "-");
      } else {
        setText("attrWeak", "-");
        setText("attrResist", "-");
      }
      compute();
    });

    $("playerLevel")?.addEventListener("input", () => {
      const level = $("playerLevel").value;
      const corrMul = (1 + 0.016949 * (level - 1)) * 100;
      const corr = fmt(corrMul, 2) ?? "-";
      $("lvCorrPct").value = corr;

      const coeff = lvCoeffTable[level] ?? "-";
      setValue("lvCoeff", coeff);
      compute();
    });

    document.querySelectorAll('input[name="calcMode"]').forEach(el => {
      el.addEventListener("change", () => {
        updateVisibilityByMode();
        compute();
      });
    });

    const KEY = 'theme-preference'; // 'light' | 'dark'
    const body = document.body;
    const btn = document.getElementById('toggleTheme');
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (pref) => {
      body.classList.remove('theme-light', 'theme-dark');
      if (pref) body.classList.add(`theme-${pref}`);
    };

    const getPref = () => localStorage.getItem(KEY);

    const setPref = (pref) => {
      localStorage.setItem(KEY, pref);
      applyTheme(pref);
    };

    // 初期適用：保存がなければ OS 設定に従う
    const saved = getPref();
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme(media.matches ? 'dark' : 'light');
    }

    // OS設定が変わったら、ユーザーが手動指定していない場合のみ追従
    media.addEventListener('change', () => {
      if (!getPref()) applyTheme(media.matches ? 'dark' : 'light');
    });

    // ボタンで light ↔ dark のみ切替
    btn?.addEventListener('click', () => {
      const curr = getPref() || (media.matches ? 'dark' : 'light');
      const next = curr === 'light' ? 'dark' : 'light';
      setPref(next);
      btn.textContent = `テーマ: ${next}`;
    });

    // 初期ボタン表示
    btn && (btn.textContent = `テーマ: ${saved || (media.matches ? 'dark' : 'light')}`);
  }

  async function init() {
    await Promise.all([
      loadJSON("./json/characters.json", characters, () => populateSelect("charSelect", characters)),
      loadJSON("./json/enemies.json", enemies, () => populateSelect("enemSelect", enemies)),
      loadJSON("./json/lvCoeffTable.json", lvCoeffTable)
    ]);
    applyDefaults();
    bindEvents();
    updateVisibilityByMode();
    updateAnomalyCorr();
    compute();
  }

  init();
})();