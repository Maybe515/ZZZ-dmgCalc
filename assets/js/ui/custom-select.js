// Custom Select を生成するモジュール

/**
 * カスタムセレクトを生成する
 * @param {HTMLElement} root - <div class="custom-select"> の器
 * @param {Array} options - { value, label?, i18n? } の配列
 */
export function createCustomSelect(root, options) {
  root.classList.add("custom-select-root");

  const id = root.id;

  // 表示部分
  const display = document.createElement("div");
  display.className = "custom-select-display";

  // リスト部分
  const list = document.createElement("div");
  list.className = "custom-select-list";

  // 現在の値
  let currentValue = options[0].value;

  // 表示更新関数（内部・外部共通）
  function updateDisplay(value) {
    const opt = options.find(o => o.value === value) || options[0];
    currentValue = opt.value;

    display.textContent = opt.label ?? opt.i18n ?? opt.value;
    display.dataset.i18n = opt.i18n;

    // selected クラス更新
    list.querySelectorAll(".custom-select-item").forEach(item => {
      item.classList.toggle("selected", item.dataset.value === value);
    });
  }

  // 初期表示
  updateDisplay(currentValue);

  // リスト生成
  options.forEach(opt => {
    const item = document.createElement("div");
    item.className = "custom-select-item";

    item.textContent = opt.label ?? opt.i18n ?? opt.value;
    item.dataset.value = opt.value;
    item.dataset.i18n = opt.i18n;

    item.addEventListener("click", () => {
      updateDisplay(opt.value);
      list.classList.remove("open");

      // ★ カスタムイベントを発火する
      root.dispatchEvent(
        new CustomEvent("select:change", {
          detail: { id, value: opt.value }
        })
      );
    });

    list.appendChild(item);
  });

  // 開閉
  display.addEventListener("click", () => {
    list.classList.toggle("open");
  });

  root.appendChild(display);
  root.appendChild(list);

  // ★ 外部から値をセットできる API を返す
  return {
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
