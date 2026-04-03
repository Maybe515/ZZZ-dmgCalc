// <details> 要素の閉じるアニメーションを制御するモジュール
const ANIMATION_DURATION = 400;     // CSS のアニメーション時間と合わせる

export function initDetailsAnimation() {
  const detailsList = document.querySelectorAll("details");

  detailsList.forEach(details => {
    const summary = details.querySelector("summary");
    if (!summary) return; // 安全性向上

    summary.addEventListener("click", e => {
      if (!details.open) return;

      // デフォルトの即閉じを止める
      e.preventDefault();

      // アニメーション開始
      details.classList.add("is-closing");

      // アニメーション終了後に閉じる
      setTimeout(() => {
        details.classList.remove("is-closing");
        details.removeAttribute("open");
      }, ANIMATION_DURATION);
    });
  });
}
