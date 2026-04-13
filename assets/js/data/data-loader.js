// JSON データのロードとセレクト生成を担当するモジュール
// ---------------- Imports ----------------
// UI
import { applyLanguage } from "../ui/language.js";

// Data stores
import { agents, enemies, i18nDict, helpTexts, attributes, rangeTable, matchTable, miasmaBuffTable, languages, state } from "./state.js";

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
 * すべての外部ファイルを読み込む（初期化時に使用）
 */
export async function loadAllData() {
  return Promise.all([
    loadJSON("./assets/data/agents.json", agents),
    loadJSON("./assets/data/enemies.json", enemies),
    loadJSON("./assets/data/helpTexts.json", helpTexts),
    loadJSON("./assets/data/languages.json", languages),
    loadJSON("./assets/data/tables/attributes.json", attributes),
    loadJSON("./assets/data/tables/match.json", matchTable),
    loadJSON("./assets/data/tables/miasma-buff.json", miasmaBuffTable),
    loadJSON("./assets/data/tables/range.json", rangeTable)
  ]);
}

// ---------------- Language Loader ----------------
/**
 * 言語ファイルをロードして UI に適用する
 */
export async function loadLanguage() {
  const lang = state.lang || "jp";
  await loadJSON(`./assets/data/languages/${lang}.json`, i18nDict, dict => applyLanguage(dict));
}
