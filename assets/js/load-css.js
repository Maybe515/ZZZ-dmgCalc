import { getBasePath } from "./base-path.js";
const CSS_PATH = getBasePath() + "/assets/css/";

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
    "/components/toast.css",
    "/components/tooltip.css",
    "/utils/utilities.css"
];

// CSS 読み込み
export function loadCssFiles() {
    cssFiles.forEach(path => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_PATH + path;
        document.head.appendChild(link);
    });
}

loadCssFiles();