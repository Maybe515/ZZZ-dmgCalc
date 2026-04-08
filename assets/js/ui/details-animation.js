// <details> 要素の閉じるアニメーションを制御するモジュール
import { al, q, qa } from "./dom-helpers.js";

const ANIMATION_DURATION = 400;     // CSS のアニメーション時間と合わせる

export function initDetailsAnimation() {
  const detailsList = qa("details");

  detailsList.forEach(details => {
    const summary = q("summary", details);
    if (!summary) return; // 安全性向上

    al("click", e => {
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
    }, summary);
  });
}
