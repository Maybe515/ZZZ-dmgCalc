// ポップアップの表示制御をするモジュール
// ---------------- Popup control ----------------

import { sa } from "../utils/dom-helpers.js";

/**
 * ポップアップを開く
 */
export function openPopup(popup) {
  popup.style.display = "block";
  popup.classList.add("is-open");
  popup.classList.remove("is-closing");
  sa("aria-hidden", "false", popup);
}

/**
 * ポップアップを閉じる
 */
export function closePopup(popup) {
  popup.classList.add("is-closing");
  popup.classList.remove("is-open");
  
  // フォーカスを外す
  document.activeElement?.blur();   // WAI-ARIA の仕様違反回避

  popup.addEventListener("animationend", () => {
      popup.classList.remove("is-closing");
      popup.style.display = "none";
      sa("aria-hidden", "true", popup);
    },
    { once: true }
  );
}