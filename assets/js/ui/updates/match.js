// 属性相性の自動判定を担当するモジュール
import { selects, state } from "../../data/state.js";
import { $ } from "../dom-helpers.js";
import { updateAttrMatchPct } from "./derived.js";

export function updateMatchSelect() {
  // エージェントの属性
  const attribute = $("attribute").textContent.trim();

  // エネミーの弱点属性
  const weak1 = $("weakAttr1").textContent.trim();
  const weak2 = $("weakAttr2").textContent.trim();

  // エネミーの耐性属性
  const resist1 = $("resistAttr1").textContent.trim();
  const resist2 = $("resistAttr2").textContent.trim();

  if (attribute === "") {
    state.match = "none";
  } else if (attribute === weak1 || attribute === weak2) {
    state.match = "weak";
  } else if (attribute === resist1 || attribute === resist2) {
    state.match = "resist";
  } else {
    state.match = "none";
  }

  // ---------------- UI 反映（カスタムセレクト） ----------------
  selects.matchSelect.setValue(state.match);

  updateAttrMatchPct();
}
