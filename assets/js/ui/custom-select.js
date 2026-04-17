// Custom Select を生成するモジュール
import { ce, qa, sa } from "./dom-helpers.js";

/**
 * カスタムセレクトを生成する
 * @param {HTMLElement} root - <div class="custom-select"> の器
 * @param {Array} options - { value, label?, i18n? } の配列
 */
export function createCustomSelect(root, options) {
  root.classList.add("custom-select-root");

  const id = root.id;

  // 表示部分
  const display = ce("div");
  display.className = "custom-select-display";
  display.tabIndex = 0

  // ★ アイコン部分（langSelect のときだけ表示）
  const icon = ce("img");
  icon.className = "custom-select-icon";

  // langSelect のときだけ 🌎 を入れる
  if (root.id === "langSelect") {
    icon.src = "./assets/image/common/globe.svg";
    icon.alt = "";
    display.appendChild(icon);
  }

  // テキスト部分
  const label = ce("span");
  label.className = "custom-select-label";

  // ▼アイコン（SVG）
  const caret = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sa("class", "custom-select-caret", caret);
  sa("width", "20", caret);
  sa("height", "20", caret);
  sa("viewBox", "0 0 24 24", caret);

  // ▼のパス
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  sa("d", "M7 10l5 5 5-5z", path);  // ▼の形
  sa("fill", "currentColor", path);

  caret.appendChild(path);

  // リスト部分
  const list = ce("div");
  list.className = "custom-select-list";

  // 現在の値
  let currentValue = options[0].value;

  // 表示更新関数（内部・外部共通）
  function updateDisplay(value) {
    const opt = options.find(o => o.value === value) || options[0];
    currentValue = opt.value;

    label.textContent = opt.labelShort ?? opt.i18n ?? opt.value;
    label.dataset.i18n = opt.i18n;

    display.appendChild(label);
    display.appendChild(caret);

    // selected クラス更新
    qa(".custom-select-item", list).forEach(item => {
      item.classList.toggle("selected", item.dataset.value === value);
    });
  }

  // 初期表示
  updateDisplay(currentValue);

  // リストアイテム生成
  const items = options.map(opt => {
    const item = ce("div");
    item.className = "custom-select-item";
    item.textContent = opt.labelLong ?? opt.i18n ?? opt.value;
    item.dataset.value = opt.value;
    item.dataset.i18n = opt.i18n;

    list.appendChild(item);
    return item;
  });

  root.appendChild(display);
  root.appendChild(list);

  // ★ 外部から値をセットできる API を返す
  return {
    id,
    root,
    display,
    list,
    items,
    updateDisplay,
    get value() {
      return currentValue;
    },
    setValue(value) {
      updateDisplay(value);

      root.dispatchEvent(
        new CustomEvent("select:change", {
          detail: { id, value }
        })
      );
    }
  };
}
