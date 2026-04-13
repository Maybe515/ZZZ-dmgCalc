// エネミーUI の更新をするモジュール
import { enemies, i18nDict, state } from "../../data/state.js";
import { imgPaths, urls } from "../../data/paths.js";
import { updateText, updateImage, updateLink, updateAttrGroup } from "./helpers.js";
import { t } from "../../i18n/i18n-helpers.js";

export function updateEnemyInfo(dict = i18nDict) {
  const sel = state.enemyId;
  const enemy = enemies[sel] || {};

  updateImage("enemyImage", enemy.image ? `${imgPaths.base}${imgPaths.enemy}${enemy.image}` : `${imgPaths.base}${imgPaths.common}` + "empty.webp", "");
  updateLink("enemyLink", enemy.link ? urls.hoyowiki + enemy.link : "");

  updateAttrGroup(enemy.weakAttrId || [], "weakAttr", dict);
  updateAttrGroup(enemy.resistAttrId || [], "resistAttr", dict);
  
  updateImage("materialImage", enemy.material ? `${imgPaths.base}${imgPaths.material}${enemy.material}.gif` : "", "");
  updateText("material", t(dict, `material.${enemy.material}`, enemy.material));
}
