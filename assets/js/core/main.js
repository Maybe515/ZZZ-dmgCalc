// アプリケーションのエントリーポイント
// ---------------- CSS ----------------
import { loadCssFiles } from "../ui/load-css.js";

// ---------------- Data ----------------
import { loadAllData, loadLanguage } from "../data/data-loader.js";
import { loadFromLocalStorage } from "../storage/local-storage.js";

// ---------------- UI ----------------
import { applyDefaults, initCustomSelects, initStrapPhysics, loadLastModified, setupStrap } from "../events/init.js";
import { bindDetailsEvents, bindEvents, bindStrapEvents } from "../events/bind-events.js";
import { initResultFixedObserver } from "../ui/result-fixed.js";

// ---------------- Compute ----------------
import { compute } from "../calculate/compute-handler.js";

// ---------------- DOM helper ----------------
import { al } from "../ui/dom-helpers.js";

async function init() {
  // --- Load data ---
  loadCssFiles();             // CSS読み込み
  await loadAllData();        // JSONデータロード

  // --- Populate UI ---
  initCustomSelects();        // カスタムセレクトを生成する

  // --- Set Events ---
  bindEvents();               // イベントバインド
  bindDetailsEvents();        // Details 開閉アニメーション

  // --- Local Storage ---
  loadFromLocalStorage();     // 保存データ復元

  // --- Initialize UX ---
  initResultFixedObserver();  // Result 固定表示（モバイル用）

  // --- Initialize UI ---
  loadLastModified();         // 最終更新日表示
  applyDefaults();            // UI 初期値適用 (ロード後に実施)
  await loadLanguage();       // 言語ロード

  compute();                  // 初回計算

  // レイアウトが確定してから処理
  requestAnimationFrame(() => {
    const strapState = setupStrap();    // 物理ストラップを生成する
    if (strapState) bindStrapEvents();  // イベント設定
    window.strapState = strapState;
  });
}

// DOM 準備後に実行
document.readyState === "loading"
  ? al("DOMContentLoaded", init)
  : init();
