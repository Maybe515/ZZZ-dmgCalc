// 数値を指定桁数でフォーマットするモジュール（非数値は "-" を返す）
const FALLBACK = "-";

/**
 * 数値を小数点以下 d 桁でフォーマットする
 * @param {number} v - フォーマット対象の値
 * @param {number} d - 小数点以下の桁数
 */
export function fmt(v, d) {
  return Number.isFinite(v) ? v.toFixed(d) : FALLBACK;
}
