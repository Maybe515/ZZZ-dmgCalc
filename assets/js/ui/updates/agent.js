// エージェントUI を更新するモジュール
import { agents, i18nDict, state } from "../../data/state.js";
import { imgPaths, urls } from "../../data/paths.js";
import { updateText, updateIcon, updateImage, updateLink } from "./helpers.js";
import { t } from "../../i18n/i18n-helpers.js";

export function updateAgentInfo(dict = i18nDict) {
  const sel = state.agentId;
  const agent = agents[sel] || {};
  
  updateImage("agentImage", agent.image ? `${imgPaths.base}${imgPaths.agent}${agent.image}` : `${imgPaths.base}${imgPaths.common}` + "empty.webp", "");
  updateImage("rankImage", agent.rank ? `${imgPaths.base}${imgPaths.rank}rank_${agent.rank}.png` : "", "");
  updateLink("agentLink", agent.link ? urls.hoyowiki + agent.link : "");
  
  updateIcon("faction", agent.factionId, `${imgPaths.base}${imgPaths.faction}`, t(dict, "ui.factionLabel"));
  updateIcon("specialty", agent.specialtyId, `${imgPaths.base}${imgPaths.specialty}`, t(dict, "ui.specialtyLabel"));
  updateIcon("attribute", agent.attributeId, `${imgPaths.base}${imgPaths.attribute}`, t(dict, "ui.attributeLabel"));
  
  updateText("faction", t(dict, `faction.${agent.factionId}`, agent.factionId));
  updateText("specialty", t(dict, `specialty.${agent.specialtyId}`, agent.specialtyId));
  updateText("attribute", t(dict, `attribute.${agent.attributeId}`, agent.attributeId));
}
