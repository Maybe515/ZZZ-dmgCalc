// 計算モード（normal / anomaly）の状態を取得を担当するモジュール
import { q } from "../utils/dom-helpers.js";

const DEFAULT_MODE = "mode--normal";

/**
 * 現在選択されている計算モードを返す
 * @returns {string} "mode--normal" | "mode--anomaly"
 */
export function getCalcMode() {
  const selected = q('input[name="calcMode"]:checked');
  return selected?.value || DEFAULT_MODE;
}
