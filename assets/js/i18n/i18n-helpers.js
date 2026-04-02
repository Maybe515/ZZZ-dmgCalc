// i18n（国際化）関連のヘルパー関数
import { $ } from "../ui/dom-helpers.js";

/**
 * 辞書からキーを取得する（存在しない場合は fallback）
 * @param {object} dict - 翻訳辞書
 * @param {string} key - 辞書キー
 * @param {string} fallback - 見つからない場合の値
 */
export function t(dict, key, fallback = "") {
  if (!dict || typeof dict !== "object") return fallback;
  return dict[key] !== undefined ? dict[key] : fallback;
}

/**
 * ラベルオブジェクトから現在の言語の値を取得する
 * @param {object} labels - { jp: "...", en: "...", ... }
 */
export function getLabelValue(labels) {
  if (!labels || typeof labels !== "object") return "";

  const lang = $("langSelect")?.value || "jp";
  return labels[lang] || labels.jp || "";
}
