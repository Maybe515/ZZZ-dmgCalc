// 通常モードのダメージ計算

import { percent } from "./math-utils.js";
import { fmt } from "./fmt.js";

/**
 * 通常モードのダメージ計算
 */
export function computeNormal(
  v,
  digits,
  totalBonus,
  breakBonusMul,
  weakRangeMul,
  defMul,
  resistMul,
  setText
) {
  // --- 基礎ダメージ ---
  const base = v.atk * percent.toFrac(v.skillPct);

  // --- クリティカル倍率 ---
  const critMul = 1 + percent.toFrac(v.critDmgPct);

  // 期待クリ倍率 = 1 + (クリ率 × クリダメ)
  const expCritMul =
    1 + percent.toFrac(v.critRatePct) * percent.toFrac(v.critDmgPct);

  // --- ダメージ関数 ---
  const dmgFn = critMultiplier =>
    base *
    totalBonus *
    critMultiplier *
    breakBonusMul *
    weakRangeMul *
    defMul *
    resistMul;

  // --- UI 更新 ---
  setText("base", fmt(base, digits));

  setText("nonCritMul", fmt(1, digits + 2));
  setText("critMul", fmt(critMul, digits + 2));
  setText("expCritMul", fmt(expCritMul, digits + 2));

  setText("nonCrit", fmt(dmgFn(1), digits));
  setText("crit", fmt(dmgFn(critMul), digits));
  setText("expected", fmt(dmgFn(expCritMul), digits));
}
