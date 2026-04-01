// JSON データのロードとセレクト生成を担当するモジュール

// ---------------- Imports ----------------
// UI
import { applyLanguage } from "../ui/language.js";
import { generateAgentSelect, generateEnemySelect, generateAttrSelect, generateRangeSelect, generateMatchSelect } from "../ui/generate-selects.js";
import { $ } from "../ui/dom-helpers.js";

// Data stores
import { agents, enemies, i18nDict, helpTexts, attributes, rangeTable, matchTable } from "./state.js";

// ---------------- JSON Loader ----------------
/**
 * JSON をロードして target に反映する
 * - 配列なら置き換え
 * - オブジェクトならマージ
 */
async function loadJSON(path, target, callback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} 読み込み失敗`);

    const data = await res.json();

    if (Array.isArray(target) && Array.isArray(data)) {
      target.splice(0, target.length, ...data);
    } else if (typeof target === "object" && typeof data === "object") {
      Object.assign(target, data);
    }

    callback?.(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ---------------- All Data Loader ----------------
/**
 * 全データをロードする（初期化時に使用）
 */
export async function loadAllData() {
  const lang = $("langSelect").value || "jp";

  return Promise.all([
    loadJSON("./assets/data/agents.json", agents, () =>
      generateAgentSelect()
    ),
    loadJSON("./assets/data/enemies.json", enemies, () =>
      generateEnemySelect()
    ),
    loadJSON("./assets/data/attributes.json", attributes, () =>
      generateAttrSelect()
    ),
    loadJSON("./assets/data/tables/range.json", rangeTable, () =>
      generateRangeSelect()
  ),
    loadJSON("./assets/data/tables/match.json", matchTable, () =>
    generateMatchSelect()
  ),
    loadJSON("./assets/data/helpTexts.json", helpTexts),
    loadJSON(`./assets/data/languages/${lang}.json`, i18nDict, dict =>
      applyLanguage(dict)
    )
  ]);
}

// ---------------- Language Loader ----------------
/**
 * 言語ファイルをロードして UI に適用する
 */
export async function loadLanguage() {
  const lang = $("langSelect").value || "jp";
  await loadJSON(
    `./assets/data/languages/${lang}.json`,
    i18nDict,
    dict => applyLanguage(dict)
  );
}
