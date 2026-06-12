// 「結果カード」の値をコピーするモジュール
import { q } from "../utils/dom-helpers.js";

/**
 * クリックされた要素からコピー対象のテキストを取得
 */
export function getCopyResult(target) {
  const card = target.closest(".result__card");
  if (!card) return null;

  const valueEl = q(".result__value", card);
  const text = valueEl?.textContent?.trim();

  return text && text !== "-" ? text : null;
}
