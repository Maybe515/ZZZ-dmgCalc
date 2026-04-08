// 通常攻撃時のダメージ計算を行うモジュール
import { percent } from "./math-utils.js";
import { fmt } from "./fmt.js";

/**
 * 通常モードのダメージ計算
 */
export function computeNormal(
  v,
  base,
  digits,
  totalBonus,
  breakBonusMul,
  weakRangeMul,
  defMul,
  resistMul,
  dmgCutMul,
  setText
) {
  
  const baseMul = base * percent.toFrac(v.skillPct);    // 基礎ダメージ（攻撃力 × スキルダメージ倍率）
  const critMul = 1 + percent.toFrac(v.critDmgPct);   // 会心倍率

  // 期待値会心倍率 = 1 + (会心率 × 会心ダメージ倍率)
  const expCritMul =    
    1 + percent.toFrac(v.critRatePct) * percent.toFrac(v.critDmgPct);

  // --- ダメージ関数 ---
  const dmgFn = critMultiplier =>
    baseMul *
    totalBonus *
    critMultiplier *
    breakBonusMul *
    weakRangeMul *
    defMul *
    resistMul *
    dmgCutMul;

  // --- UI 更新 ---
  setText("base", fmt(baseMul, digits));

  setText("nonCritMul", fmt(1, digits + 2));
  setText("critMul", fmt(critMul, digits + 2));
  setText("expCritMul", fmt(expCritMul, digits + 2));

  setText("nonCrit", fmt(dmgFn(1), digits));
  setText("crit", fmt(dmgFn(critMul), digits));
  setText("expected", fmt(dmgFn(expCritMul), digits));
}
