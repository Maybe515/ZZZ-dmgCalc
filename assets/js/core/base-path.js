// 実行環境（Local or GitHub Pages）に応じてベースパスを返す

const REPO_NAME = "ZZZ-dmgCalc";

// GitHub Pages で動作しているか判定
function isGitHubPages() {
  return location.hostname.endsWith("github.io");
}

// ベースパスを返す
export function getBasePath() {
  return isGitHubPages() ? `/${REPO_NAME}` : "";
}
