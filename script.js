(function () {
  const $ = (id) => document.getElementById(id);

  const fields = [
    "atkLevel","atk","skillPct","flatAdd","dmgBonusPct",
    "critRatePct","critDmgPct",
    "defLevel","resPct","resShredPct","defIgnorePct","defReducePct","vulnPct",
    "resMin","resMax","digits"
  ];

  const defaults = {
    atkLevel: 60, atk: 1500, skillPct: 240, flatAdd: 0, dmgBonusPct: 40,
    critRatePct: 5, critDmgPct: 50,
    defLevel: 60, resPct: 10, resShredPct: 0, defIgnorePct: 0, defReducePct: 0, vulnPct: 0,
    resMin: -100, resMax: 90, digits: 0
  };

  const characters = {
    "エレン": { atk: 1450, skillPct: 240 },
    "ニコ": { atk: 1300, skillPct: 180 },
    "ビリー": { atk: 1600, skillPct: 210 }
  };

  // Load defaults
  fields.forEach(k => { if (!$(k).value) $(k).value = defaults[k]; });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pctToMul = (p) => 1 + p / 100;
  const pctToFrac = (p) => p / 100;
  const fmt = (v, d) => isFinite(v) ? Number(v).toFixed(d) : "-";

  function compute() {
    // 基礎パラメータ
    const atkLevel = Number($("atkLevel").value) || 1;
    const atk = Number($("atk").value) || 0;
    const penRetio = Number($("penRetioPct").value) || 0;
    const pen = Number($("pen").value) || 0;

    // 会心補正
    const critRate = pctToFrac(Number($("critRatePct").value) || 0)
    const critDmg = pctToFrac(Number($("critDmgPct").value) || 0);
    const expCritDmg = base * (1 + critRate * critDmg);

    // 属性ダメ・与ダメ補正
    const attrBonus = pctToFrac(Number($("AttrBonusPct").value) || 0);
    const dmgBonus = pctToFrac(Number($("dmgBonusPct").value) || 0);
    const dmgBonusPt = pctToFrac(Number($("dmgBonusPtPct").value) || 0);
    const totalBonus = 1 + attrBonus + dmgBonus + dmgBonusPt;

    //その他
    const skillDmg = Number($("skillPct").value) || 0;
    const breakBonusPct = Number($("breakBonusPct").value) || 0;

    //エネミー
    const defLevel = Number($("defLevel").value) || 1;
    const def = Number($("def").value) || 0;
    const defUpPct = pctToFrac(Number($("defUpPct").value) || 0);
    const defDownPct = pctToFrac(Number($("defDownPct").value) || 0);







    const defMul = denom > 0 ? (atkLevel + 100) / denom : 1;

    const nonCritMul = 1;

    const res = Number($("resPct").value) || 0;
    const resShred = Number($("resShredPct").value) || 0;
    const resMin = Number($("resMin").value) || -9999;
    const resMax = Number($("resMax").value) || 9999;
    const effRes = clamp(res - resShred, resMin, resMax);
    const resMul = 1 - effRes / 100;

    const vulnMul = pctToMul(Number($("vulnPct").value) || 0);

    const base = atk * skillDmg;
    const pipeline = base * dmgBonusMul * defMul * resMul * vulnMul;

    const digits = Math.max(0, Math.min(6, Number($("digits").value) || 0));
    const nonCrit = pipeline * nonCritMul;
    const crit = pipeline * critDmgMul;
    const expected = pipeline * expCritMul;

    $("base").textContent = fmt(base, digits);
    $("dmgMul").textContent = fmt(dmgBonusMul, 2);
    $("defMul").textContent = fmt(defMul, 4);
    $("resMul").textContent = fmt(resMul, 4);
    $("vulnMul").textContent = fmt(vulnMul, 4);
    $("nonCritMul").textContent = fmt(nonCritMul, 2);
    $("critMul").textContent = fmt(critDmgMul, 2);
    $("expCritMul").textContent = fmt(expCritMul, 4);

    $("nonCrit").textContent = fmt(nonCrit, digits);
    $("crit").textContent = fmt(crit, digits);
    $("expected").textContent = fmt(expected, digits);
  }

  // Bind events
  fields.forEach(k => { $(k).addEventListener("input", compute); });
  $("resetBtn").addEventListener("click", () => {
    fields.forEach(k => { $(k).value = defaults[k]; });
    compute();
  });

  $("charSelect").addEventListener("change", () => {
    const selected = $("charSelect").value;
    if (characters[selected]) {
        $("atk").value = characters[selected].atk;
        $("skillPct").value = characters[selected].skillPct;
        compute(); // 再計算
    }
    });

  compute();
})();
