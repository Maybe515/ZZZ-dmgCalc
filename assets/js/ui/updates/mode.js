// モード切り替えによる UI 更新をするモジュール
import { qa } from "../../utils/dom-helpers.js";
import { getCalcMode } from "../mode.js";

export function updateVisibilityByMode() {
  const mode = getCalcMode();

  const toggleClasses = [
    { selector: ".is-disabled-normal", condition: mode === "mode--normal" },
    { selector: ".is-disabled-anomaly", condition: mode === "mode--anomaly" }
  ];

  toggleClasses.forEach(({ selector, condition }) =>
    qa(selector).forEach(el => el.classList.toggle("is-disabled", condition))
  );

  qa(".is-hidden-anomaly").forEach(el => {
    el.style.display = mode === "mode--anomaly" ? "none" : "";
  });

  document.body.dataset.mode = mode;
}
