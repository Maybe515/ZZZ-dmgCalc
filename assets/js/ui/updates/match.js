// 属性相性の自動判定

import { $ } from "../dom-helpers.js";
import { updateAttrMatchPct } from "./derived.js";

export function updateMatchSelect() {
  const attribute = $("attribute").textContent.trim();
  const weak1 = $("weakAttr1").textContent.trim();
  const weak2 = $("weakAttr2").textContent.trim();
  const resist1 = $("resistAttr1").textContent.trim();
  const resist2 = $("resistAttr2").textContent.trim();

  const matchSelect = $("matchSelect");

  if (attribute === weak1 || attribute === weak2) {
    matchSelect.value = "weak";
  } else if (attribute === resist1 || attribute === resist2) {
    matchSelect.value = "resist";
  } else {
    matchSelect.value = "none";
  }

  updateAttrMatchPct();
}
