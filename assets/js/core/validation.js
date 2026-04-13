// バリデーション / データ検証
import { agents, state } from "../data/state.js";

/**
 * 指定した役割と選択されているエージェントの役割が一致しているか判別する
 * @param {string} target 
 * @returns {Boolean} true / false
 */
export function isValidSpecialty(target) {
  const sel = state.agentId;
  const agent = agents[sel] || {};
  const specialty = agent.specialtyId;
  return specialty === target;
}