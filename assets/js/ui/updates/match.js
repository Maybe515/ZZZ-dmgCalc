// 属性相性の自動判定を担当するモジュール
import { agents, enemies, selects, state } from "../../data/state.js";
import { updateAttrMatchPct } from "./derived.js";
import { attrAliasMapping } from "../../data/form-config.js";

export function updateMatchSelect() {
  // ----- Agent -----
  const agentSel = state.agentId;
  const agent = agents[agentSel] || {};

  // 属性
  const rawAttr = agent.attributeId;
  const attribute = attrAliasMapping[rawAttr] ?? rawAttr;

  // ----- Enemy -----
  const enemySel = state.enemyId;
  const enemy = enemies[enemySel] || {};
  const weak = enemy.weakAttrId ?? [];
  const resist = enemy.resistAttrId ?? [];

  // 弱点属性
  const weak1 = weak[0] ?? "";
  const weak2 = weak[1] ?? "";

  // 耐性属性
  const resist1 = resist[0] ?? "";
  const resist2 = resist[1] ?? "";

  const weakSet = new Set([weak1, weak2]);
  const resistSet = new Set([resist1, resist2]);

  // 属性相性チェック
  let match = "none";

  if (attribute && weakSet.has(attribute)) {
    match = "weak";
  } else if (attribute && resistSet.has(attribute)) {
    match = "resist";
  }

  state.match = match;

  // ---------------- UI 反映（カスタムセレクト） ----------------
  selects.matchSelect.setValue(state.match);

  updateAttrMatchPct();
}
