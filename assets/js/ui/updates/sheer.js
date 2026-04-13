// 透徹に関するフォームを制御するモジュール
import { $, q } from "../dom-helpers.js";
import { agents, state } from "../../data/state.js";

const sheerForce = $("sheerForce");
const sheerForceLabel = q('label[for="sheerForce"]');
const sheerForceDmgBonus = $("sheerForceDmgBonusPct");
const sheerForceDmgBonusLabel = q('label[for="sheerForceDmgBonusPct"]');

export function updateSheerField() {
    const sel = state.agentId;
    const agent = agents[sel] || {};
    const specialty = agent.specialtyId;

    const disabled = specialty !== "rupture";

    sheerForce.classList.toggle("is-disabled", disabled);
    sheerForceLabel.classList.toggle("is-disabled", disabled);

    sheerForceDmgBonus.classList.toggle("is-disabled", disabled);
    sheerForceDmgBonusLabel.classList.toggle("is-disabled", disabled);
}