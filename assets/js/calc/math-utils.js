// 数値処理を行うユーティリティ

/**
 * p% を (1 + p/100) の乗算倍率に変換する
 * 例: 20 → 1.2
 */
function toMul(p) {
  const n = Number(p);
  return Number.isFinite(n) ? 1 + n / 100 : 1;
}

/**
 * p% を 0〜1 の小数に変換する
 * 例: 20 → 0.2
 */
function toFrac(p) {
  const n = Number(p);
  return Number.isFinite(n) ? n / 100 : 0;
}

export const percent = {
  toMul,
  toFrac
};

/**
 * x を 小数点第2位に四捨五入する
 * 例: 50 → 0.5
 */
export function round2(x) {
  const n = Number(x);
  return Math.round(n * 100) / 100;
}

/**
 * キャラレベル補正率を算出する
 */
export function calcurateLevelCorrect(lv) {
  const n = Number(lv);
  const lvCorr = (1 + 0.016949 * (n - 1)) * 100;
  return round2(lvCorr);  // 小数点第2位で四捨五入
}