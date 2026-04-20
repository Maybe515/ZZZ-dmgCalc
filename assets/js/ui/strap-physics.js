// 物理ストラップの生成、制御を担当するモジュール
import { ce } from "../utils/dom-helpers.js";

/**
 * 物理ストラップ本体を生成する
 */
export function createStrapPhysics(el, options = {}) {
  let running = true;
  let rafId = null;

  // オプション（デフォルト値）
  const {
    anchorEl,
    length = 120,
    gravity = 0.002,
    damping = 0.995,
    initialAngle = 0.3,
    lineEl = null,
    onUpdate = null
  } = options;

  let angle = initialAngle;
  let velocity = 0;
  let currentLength = length;     // 現在の線の長さ

  function render() {
    // ★ 毎フレーム、アンカーの中心座標を取り直す
    const anchorRect = anchorEl.getBoundingClientRect();
    const anchorX = anchorRect.left + window.scrollX + anchorRect.width / 2;
    const anchorY = anchorRect.top + window.scrollY + anchorRect.height / 2;

    // 座標計算
    const x = anchorX + Math.sin(angle) * currentLength;
    const y = anchorY + Math.cos(angle) * currentLength;

    // ★ el は wrapper 内にあるので wrapper の絶対座標を引く
    const wrapperRect = el.parentElement.getBoundingClientRect();
    const wrapperDocX = wrapperRect.left + window.scrollX;
    const wrapperDocY = wrapperRect.top + window.scrollY;

    const localX = x - wrapperDocX - el.offsetWidth / 2;
    const localY = y - wrapperDocY - el.offsetHeight / 2;

    el.style.transform = `translate(${localX}px, ${localY}px) rotate(${-angle}rad)`;

    if (onUpdate) onUpdate({ x, y, angle });
  }

  function animate() {
    if (!running) return;

    // 重力による角加速度
    const force = -gravity * Math.sin(angle);
    velocity += force;
    velocity *= damping;
    angle += velocity;

    // バネ係数
    const springK = 0.1;
    const springForce = -springK * (currentLength - length);
    currentLength += springForce;

    render();
    rafId = requestAnimationFrame(animate);
  }

  animate();

  // 外部から揺らせる API を返す
  return {
    nudge(power = 0.2) {
      velocity += power;
      angle += power;
    },
    /** 物理演算を一時停止　*/
    pause() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
    /** 物理演算を再開　*/
    resume() {
      if (!running) {
        running = true;
        animate();
      }
    },
    setAngle(a) {
      angle = a;
      velocity = 0;   // ドラッグ中は速度リセット
      render();
    },
    setLength(newLength) {
      currentLength = newLength;
      render();
    },
    destroy() {
      // アニメーションを停止
      cancelAnimationFrame(rafId);
      rafId = null;

      // strap-circle の transform をリセット
      el.style.transform = "";

      // strap-line を削除
      if (options.lineEl) {
        options.lineEl.style.transform = "";
        options.lineEl.style.width = ""
        options.lineEl.remove();
      }
    }
  };
}

/**
 * 物理ストラップの紐を描画する
 */
export function createStrapLine(anchorEl, circleEl, wrapperEl) {
  const line = ce("div");
  line.className = "strap-line";
  anchorEl.appendChild(line);

  function update() {
    const rect = circleEl.getBoundingClientRect();
    return updateLine(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function updateWithPoint(x, y) {
    return updateLine(x, y);
  }

  function updateLine(circleX, circleY) {
    // wrapper の絶対座標
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const wrapperDocX = wrapperRect.left + window.scrollX;
    const wrapperDocY = wrapperRect.top + window.scrollY;

    // anchor の絶対座標
    const anchorRect = anchorEl.getBoundingClientRect();
    const anchorAbsX = anchorRect.left + window.scrollX + anchorRect.width / 2;
    const anchorAbsY = anchorRect.top + window.scrollY + anchorRect.height / 2;

    // ★ wrapper 内座標に変換
    const anchorX = anchorAbsX - wrapperDocX;
    const anchorY = anchorAbsY - wrapperDocY;

    const dx = circleX - anchorX;
    const dy = circleY - anchorY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}rad)`;

    return length;
  }

  return { update, updateWithPoint, el: line };
}
