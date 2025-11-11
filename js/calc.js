// calc.js
export const percent = {
    toMul: p => 1 + p / 100,
    toFrac: p => p / 100
};

export const fmt = (v, d) => Number.isFinite(v) ? Number(v).toFixed(d) : "-";

export function computeNormal(v, digits, totalBonus, breakBonusMul, weakRangeMul, defMul, resistMul, setText) {
    const base = v.atk * percent.toFrac(v.skillPct);
    const critMul = 1 + percent.toFrac(v.critDmgPct);
    const expCritMul = 1 + percent.toFrac(v.critRatePct) * percent.toFrac(v.critDmgPct);
    const dmgFn = mul => base * totalBonus * mul * breakBonusMul * weakRangeMul * defMul * resistMul;

    setText("base", fmt(base, digits));
    setText("nonCritMul", fmt(1, digits + 2));
    setText("critMul", fmt(critMul, digits + 2));
    setText("expCritMul", fmt(expCritMul, digits + 2));
    setText("nonCrit", fmt(dmgFn(1), digits));
    setText("crit", fmt(dmgFn(critMul), digits));
    setText("expected", fmt(dmgFn(expCritMul), digits));
}

export function computeAnomaly(v, digits, totalBonus, breakBonusMul, defMul, resistMul, setText) {
    const anomaly = v.anomalyMastery / 100;
    const lvCorrMul = percent.toMul(v.lvCorrPct);
    const anomalyMul = percent.toMul(v.anomalyCorrPct);
    const dmgFn = mul =>
        v.atk * totalBonus * mul * breakBonusMul * anomaly * lvCorrMul * anomalyMul * defMul * resistMul;

    setText("base", fmt(v.atk, digits));
    ["nonCritMul", "critMul", "expCritMul"].forEach(id => setText(id, "-"));
    setText("expected", fmt(dmgFn(1), digits));
}
