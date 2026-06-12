// 座標計算を行うユーティリティ
/**
 * 指定したドキュメントの中央座標を取得する
 * @param {Element} el 
 */
export function getDocumentCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX + rect.width / 2,
    y: rect.top + window.scrollY + rect.height / 2
  };
}

/**
 * ラッパーの座標を取得する
 * @param {Element} wrapperEl 
 * @param {Double} docX 
 * @param {Double} docY 
 */
export function toWrapperCoords(wrapperEl, docX, docY) {
  const rect = wrapperEl.getBoundingClientRect();
  const wx = rect.left + window.scrollX;
  const wy = rect.top + window.scrollY;
  return {
    x: docX - wx,
    y: docY - wy
  };
}