// CSS を動的に読み込むユーティリティ
import { ce } from "./dom-helpers.js";
import { getBasePath } from "../core/base-path.js";

// CSS のベースパス
function getCssBasePath() {
  return getBasePath() + "/assets/css";
}

// 読み込む CSS ファイル一覧
const cssFiles = [
  "/foundation/base.css",
  "/foundation/divider.css",
  "/foundation/layout.css",
  "/foundation/links.css",
  "/components/agent-enemy-select.css",
  "/components/button.css",
  "/components/card.css",
  "/components/details.css",
  "/components/footer.css",
  "/components/form.css",
  "/components/header.css",
  "/components/headings.css",
  "/components/icon.css",
  "/components/key-value.css",
  "/components/mode-toggle.css",
  "/components/popup.css",
  "/components/responsive.css",
  "/components/result.css",
  "/components/select.css",
  "/components/strap.css",
  "/components/toast.css",
  "/components/tooltip.css",
  "/utils/utilities.css"
];

// 読み込み済みチェック用
let loaded = false;

/** CSS を動的に読み込む */
export function loadCssFiles() {
  if (loaded) return; // 二重ロード防止
  loaded = true;

  const base = getCssBasePath();

  cssFiles.forEach(path => {
    const link = ce("link");
    link.rel = "stylesheet";
    link.href = base + path;
    document.head.appendChild(link);
  });
}
