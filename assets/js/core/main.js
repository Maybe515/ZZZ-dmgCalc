// アプリケーションのエントリーポイント
// ---------------- CSS ----------------
import { loadCssFiles } from "../ui/load-css.js";

// ---------------- Data ----------------
import { loadAllData, loadLanguage } from "../data/data-loader.js";
import { loadFromLocalStorage } from "../storage/local-storage.js";

// ---------------- UI ----------------
import { applyDefaults, initCustomSelects, loadLastModified } from "../events/init.js";
import { bindEvents } from "../events/bind-events.js";
import { initDetailsAnimation } from "../ui/details-animation.js";
import { initResultFixedObserver } from "../ui/result-fixed.js";

// ---------------- Compute ----------------
import { compute } from "../calculate/compute-handler.js";

async function init() {
  loadCssFiles();             // CSS読み込み

  await loadAllData();        // JSONデータロード
  loadFromLocalStorage();     // 保存データ復元
  loadLastModified();         // 最終更新日表示
  initCustomSelects();        // カスタムセレクトを生成する
  applyDefaults();            // UI 初期値適用 (ロード後に実施)
  await loadLanguage();       // 言語ロード

  bindEvents();               // イベントバインド

  initDetailsAnimation();     // Details 開閉アニメーション
  initResultFixedObserver();  // Result 固定表示（モバイル用）

  compute();                  // 初回計算
}

// DOM 準備後に実行
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
