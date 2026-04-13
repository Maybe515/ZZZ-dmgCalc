// UI 更新の基礎関数モジュール
import { $ } from "../dom-helpers.js";
import { t } from "../../i18n/i18n-helpers.js";
import { i18nDict } from "../../data/state.js";

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

  if (key) {
    el.style.display = "";
    if (key != "none") {
      el.src = `${iconPath}${key}${ext}`;
    } else {
      el.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XWiwAAAABJRU5ErkJggg==";
    }
    el.alt = altLabel ? `${altLabel}: ${t(i18nDict, `${id}.${key}`, key)}` : key;
  } else {
    el.style.display = "none";
    el.src = ""
    el.alt = "";
  }
}

export function updateImage(id, src, alt) {
  const el = $(id);
  if (!el) return;

  if (!src) {
    el.style.display = "none";
    el.src = "";
    el.alt = "";
    return;
  }

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
