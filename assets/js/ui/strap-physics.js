// 物理ストラップの生成、制御を担当するモジュール
import { ce } from "./dom-helpers.js";

/**
 * 物理ストラップ本体を生成する
 */
export function createStrapPhysics(el, options = {}) {
  // オプション（デフォルト値）
  const {
    anchorX = 0,
    anchorY = 0,
    length = 120,
    gravity = 0.002,
    damping = 0.995,
    initialAngle = 0.3,
    onUpdate = null
  } = options;

  let angle = initialAngle;
  let velocity = 0;

  function animate() {
    // 重力による角加速度
    const force = -gravity * Math.sin(angle);
    velocity += force;
    velocity *= damping;
    angle += velocity;

    // 座標計算
    const x = anchorX + Math.sin(angle) * length;
    const y = anchorY + Math.cos(angle) * length;

    // transform で位置と回転を適用
    el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;

    if (onUpdate) {
      const centerX = x + el.offsetWidth / 2;
      const centerY = y + el.offsetHeight / 2;
      onUpdate({ x: centerX, y: centerY, angle });
    }

    requestAnimationFrame(animate);
  }

  animate();

  // 外部から揺らせる API を返す
  return {
    nudge(power = 0.2) {
      velocity += power;
    }
  };
}

/**
 * 物理ストラップの紐を描画する
 */
export function createStrapLine(anchorEl, circleEl) {
  const line = ce("div");
  line.className = "strap-line";
  anchorEl.appendChild(line);

  function update() {
    // circle の絶対座標（ページ座標）
    const circleRect = circleEl.getBoundingClientRect();
    const circleX = circleRect.left + circleRect.width / 2;
    const circleY = circleRect.top + circleRect.height / 2;

    // anchor の絶対座標（ページ座標）
    const anchorRect = anchorEl.getBoundingClientRect();
    const anchorX = anchorRect.left + anchorRect.width / 2;
    const anchorY = anchorRect.top + anchorRect.height / 2;

    const dx = circleX - anchorX;
    const dy = circleY - anchorY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}rad)`;
  }

  return { update };
}
