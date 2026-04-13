// エネミーUI の更新をするモジュール
import { enemies, i18nDict, state } from "../../data/state.js";
import { imgPaths, urls } from "../../data/paths.js";
import { updateText, updateImage, updateLink, updateAttrGroup } from "./helpers.js";
import { t } from "../../i18n/i18n-helpers.js";

export function updateEnemyInfo(dict = i18nDict) {
  const sel = state.enemyId;
  const enemy = enemies[sel] || {};
  const materal = enemy.material;

  updateImage("enemyImage", enemy.image ? `${imgPaths.base}${imgPaths.enemy}${enemy.image}` : `${imgPaths.base}${imgPaths.common}` + "empty.webp", enemy.image);
  updateLink("enemyLink", enemy.link ? urls.hoyowiki + enemy.link : "");

  updateAttrGroup(enemy.weakAttrId || [], "weakAttr", dict);
  updateAttrGroup(enemy.resistAttrId || [], "resistAttr", dict);

  // material === "none"
  if (materal === "none") {
    updateImage("materialImage", "none", "");
    updateText("material", "-");
    return;
  }

  // material が空欄（null, undefined, ""）
  if (!materal) {
    updateImage("materialImage", "", "");
    updateText("material", "");
    return;
  }

  // 通常の素材（画像 + テキスト）
  updateImage("materialImage", `${imgPaths.base}${imgPaths.material}${materal}.gif`, materal);
  updateText("material", t(dict, `material.${materal}`, materal));
}