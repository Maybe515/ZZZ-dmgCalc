// ブレイクUI の制御
import { $ } from "../dom-helpers.js";

const breakToggle = $("breakToggle");
const breakControls = $("breakControls");

export const updateBreakControls = () =>
  breakControls?.classList.toggle("is-disabled", !breakToggle?.checked);
