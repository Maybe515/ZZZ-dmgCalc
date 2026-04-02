// 状態異常時のダメージ計算を行うモジュール
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
  
  const anomaly = v.anomalyMastery / 100;               // 異常マスタリー
  const lvCorrMul = percent.toMul(v.lvCorrPct);         // キャラレベル補正
  const anomalyMul = percent.toMul(v.anomalyCorrPct);   // 状態異常ダメージ補正

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

  // 状態異常時は会心が発生しないため、中間倍率に値を表示しない
  ["nonCritMul", "critMul", "expCritMul"].forEach(id => setText(id, "-"));

  // クリティカル無しのダメージを期待値として表示
  setText("expected", fmt(dmgFn(1), digits));
}
