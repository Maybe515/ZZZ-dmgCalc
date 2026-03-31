// 状態異常モードのダメージ計算

import { percent } from "./math-utils.js";
import { fmt } from "./fmt.js";

/**
 * 状態異常モードのダメージ計算
 */
export function computeAnomaly(
  v,
  digits,
  totalBonus,
  breakBonusMul,
  defMul,
  resistMul,
  setText
) {
  // --- 状態異常固有係数 ---
  const anomaly = v.anomalyMastery / 100;

  // レベル補正
  const lvCorrMul = percent.toMul(v.lvCorrPct);

  // 状態異常相性補正
  const anomalyMul = percent.toMul(v.anomalyCorrPct);

  // --- ダメージ関数 ---
  const dmgFn = anomalyMultiplier =>
    v.atk *
    totalBonus *
    anomalyMultiplier *
    breakBonusMul *
    anomaly *
    lvCorrMul *
    anomalyMul *
    defMul *
    resistMul;

  // --- UI 更新 ---
  setText("base", fmt(v.atk, digits));

  // 状態異常モードではクリティカル概念が無い
  ["nonCritMul", "critMul", "expCritMul"].forEach(id => setText(id, "-"));

  // 期待値 = クリティカル無しのダメージ
  setText("expected", fmt(dmgFn(1), digits));
}
