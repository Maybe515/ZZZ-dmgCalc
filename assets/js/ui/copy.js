// 「結果カード」の値をコピーするモジュール
/**
 * クリックされた要素からコピー対象のテキストを取得
 */
export function getCopyResult(target) {
  const card = target.closest(".result__card");
  if (!card) return null;

  const valueEl = card.querySelector(".result__value");
  const text = valueEl?.textContent?.trim();

  return text && text !== "-" ? text : null;
}
