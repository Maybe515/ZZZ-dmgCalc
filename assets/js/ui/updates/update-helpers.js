// UI 更新の基礎関数モジュール
import { $ } from "../../utils/dom-helpers.js";
import { t } from "../../i18n/i18n-helpers.js";
import { attributes, i18nDict, matchTable } from "../../data/state.js";

export function updateText(id, value) {
  const el = $(id);
  if (!el) return;

  el.textContent = value || "";
  el.title = value || "";
  el.style.display = value ? "" : "none";
}

export function updateIcon(id, key, iconPath, altLabel = "", ext = ".webp") {
  const el = $(id + "Icon");
  if (!el) return;

  if (!key) {
    el.style.visibility = "visible";
    el.style.display = "none";
    el.src = ""
    el.alt = "";
    return;
  }

  if (key === "none") {
    el.style.display = "";
    el.classList.remove("is-hidden");
    el.src = ""
    el.alt = "";
    return;
  }

  el.style.display = "";
  el.style.visibility = "visible";
  el.src = `${iconPath}${key}${ext}`;
  el.alt = altLabel ? `${altLabel}: ${t(i18nDict, `${id}.${key}`, key)}` : key;

}

export function updateImage(id, src, alt) {
  const el = $(id);
  if (!el) return;

  if (!src) {
    el.style.visibility = "visible";
    el.style.display = "none";
    el.src = "";
    el.alt = "";
    return;
  }

  if (src === "none") {
    el.style.display = "";
    el.style.visibility = "hidden";
    el.src = "";
    el.alt = "";
    return;
  }

  el.style.visibility = "visible";
  el.style.display = "";
  el.src = src;
  el.alt = alt || "";
}

export function updateLink(id, link) {
  const el = $(id);
  if (!el) return;
  el.href = link || "#";
  el.style.pointerEvents = link ? "auto" : "none";
}

export function updateAttrGroup(attrs, prefix, dict) {
  for (let i = 0; i < 2; i++) {
    const attrId = attrs[i];
    const baseId = `${prefix}${i + 1}`;

    updateText(baseId, attrId ? t(dict, `attribute.${attrId}`, attrId) : "");
    updateIcon(baseId, attrId, "assets/image/stats/", t(dict, "ui.attributeLabel", "Attribute"));
  }
}

/**
 * アプリ内データストアから属性ダメージ補正を取得する
 * @param {string} attrId 
 */
export function getAnomalyCorr(attrId) {
  return attributes[attrId]?.anomalyCorr ?? 0;
}

/**
 * アプリ内データストアから属性相性補正を取得する
 * @param {string} matchId 
 */
export function getMatchValue(matchId) {
  return matchTable[matchId]?.value ?? 0;
}
