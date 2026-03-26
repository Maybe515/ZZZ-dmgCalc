// ローカル か GitHub Page かを判別
export function getBasePath() {
  const repo = "ZZZ-dmgCalc";
  const isGitHubPages = location.hostname.endsWith("github.io");

  return isGitHubPages ? `/${repo}` : "";
}