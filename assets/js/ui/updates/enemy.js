// エネミーUI の更新をするモジュール
import { $, } from "../dom-helpers.js";
import { enemies, i18nDict } from "../../data/state.js";
import { imgPaths, urls } from "../../data/paths.js";
import { updateImage, updateLink, updateAttrGroup } from "./helpers.js";

export function updateEnemyInfo(dict = i18nDict) {
  const sel = $("enemySelect")?.value;
  const enemy = enemies[sel] || {};

  updateAttrGroup(enemy.weakAttrId || [], "weakAttr", dict);
  updateAttrGroup(enemy.resistAttrId || [], "resistAttr", dict);

  updateImage("enemyImage", enemy.image ? `${imgPaths.base}${imgPaths.enemy}${enemy.image}` : `${imgPaths.base}${imgPaths.common}` + "empty.webp", "");
  updateImage("materialImage", enemy.gif ? `${imgPaths.base}${imgPaths.material}${enemy.gif}` : "", "");
  updateLink("enemyLink", enemy.link ? urls.hoyowiki + enemy.link : "");
}
