// lang.js
import { $ } from "./ui.js";

let currentLang = "ja";

const I18N = {
  ja: {
    title: "ゼンレスゾーンゼロ ダメージ計算ツール - ZZZ Dmg Calc. -",
    description: "キャラクターのステータスを入力してダメージを計算できます。"
  },
  en: {
    title: "Zenless Zone Zero Damage Calculator - ZZZ Dmg Calc. -",
    description: "Enter character stats to calculate damage."
  }
};

/**
 * 指定言語で翻訳を適用
 */
export function applyTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang]?.[key]) {
      el.textContent = I18N[lang][key];
    }
  });
  document.documentElement.lang = lang;
}

/**
 * ローカルストレージから言語を読み込み、翻訳を適用
 */
export function loadLanguage() {
  currentLang = localStorage.getItem("lang") || "ja";
  applyTranslations(currentLang);
}

/**
 * 言語切替ボタンのバインド
 */
export function bindLanguageToggle() {
  const btn = $("langToggle");
  if (!btn) return;

  // ボタンに「次に切り替える言語」を表示
  btn.textContent = currentLang === "ja" ? "en" : "ja";

  btn.addEventListener("click", () => {
    currentLang = currentLang === "ja" ? "en" : "ja";
    localStorage.setItem("lang", currentLang);
    applyTranslations(currentLang);
    btn.textContent = currentLang === "ja" ? "en" : "ja";
  });
}
