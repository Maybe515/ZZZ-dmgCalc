// トースト通知の表示制御

import { $ } from "./dom-helpers.js";

const TOAST_DURATION = 1500; // 表示時間（ms）
let hideTimer = null;

/**
 * トーストを表示する
 */
export function showToast() {
  const toast = $("toast");
  if (!toast) return;

  // 連続表示時にタイマーをリセット
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  toast.classList.add("show");

  hideTimer = setTimeout(() => {
    toast.classList.remove("show");
    hideTimer = null;
  }, TOAST_DURATION);
}
