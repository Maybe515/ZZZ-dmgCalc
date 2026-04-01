// DOM 操作の基盤ユーティリティ（UI 全体で使用）

/**
 * ID で要素を取得
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export const $ = id => document.getElementById(id);

/**
 * セレクタで単一要素を取得
 * @param {string} sel
 * @param {ParentNode} root
 * @returns {Element|null}
 */
export const q = (sel, root = document) => root.querySelector(sel);

/**
 * セレクタで複数要素を取得（配列として返す）
 * @param {string} sel
 * @param {ParentNode} root
 * @returns {Element[]}
 */
export const qa = (sel, root = document) => [...root.querySelectorAll(sel)];

/**
 * 任意のプロパティをセット
 * @param {string} id
 * @param {string} prop
 * @param {*} value
 */
export const setEl = (id, prop, value) => {
  const el = $(id);
  if (!el) return;
  el[prop] = value;
};

/**
 * テキストをセット
 */
export const setText = (id, value) => setEl(id, "textContent", value);

/**
 * value をセット
 */
export const setValue = (id, value) => setEl(id, "value", value);
