// モバイル時の「結果パネル」を制御するモジュール
import { q } from "./dom-helpers.js";

/**
 * 通常の result セクションの内容を固定パネルへコピーする
 */
function syncResultFixedContent(normal, fixed) {
  if (!normal || !fixed) return;
  fixed.innerHTML = normal.innerHTML;
}

/**
 * IntersectionObserver が使えない環境向けのフォールバック
 */
function initFallbackVisibility(normal, fixed) {
  const toggle = () => {
    // PC では固定表示を無効化
    if (window.innerWidth > 1000) {
      fixed.classList.remove("is-visible");
      return;
    }

    const rect = normal.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 20 && rect.bottom > 0;

    fixed.classList.toggle("is-visible", !isVisible);
  };

  window.addEventListener("scroll", toggle);
  window.addEventListener("resize", toggle);
  toggle();
}

/**
 * 固定結果パネルの初期化
 */
export function initResultFixedObserver() {
  const normal = q(".result:not(.result--fixed)");
  const fixed = q(".result.result--fixed");

  if (!normal || !fixed) return;

  // 内容同期
  const mo = new MutationObserver(() => syncResultFixedContent(normal, fixed));
  mo.observe(normal, { childList: true, subtree: true, characterData: true });
  syncResultFixedContent(normal, fixed);

  // IntersectionObserver が使える場合
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        fixed.classList.toggle("is-visible", entry && !entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: "0px 0px 30px 0px" }
    );
    io.observe(normal);
    return;
  }

  // フォールバック
  initFallbackVisibility(normal, fixed);
}
