// ポップアップの表示制御

// ---------------- Popup control ----------------
export function openPopup(popup) {
  popup.style.display = "block";
  popup.classList.add("is-open");
  popup.classList.remove("is-closing");
  popup.setAttribute("aria-hidden", "false");
}

export function closePopup(popup) {
  popup.classList.add("is-closing");
  popup.classList.remove("is-open");
  
  // フォーカスを外す
  document.activeElement?.blur();   // WAI-ARIA の仕様違反回避

  popup.addEventListener(
    "animationend",
    () => {
      popup.classList.remove("is-closing");
      popup.style.display = "none";
      popup.setAttribute("aria-hidden", "true");
    },
    { once: true }
  );
}