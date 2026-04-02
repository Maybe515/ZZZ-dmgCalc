// JSON ロード後に内容が書き込まれる「アプリ内データストア」
/**
 * エージェント情報（agents.json からロード）
 * key: agentId, value: agentData
 */
export const agents = {};

/**
 * 敵情報（enemies.json からロード）
 * key: enemyId, value: enemyData
 */
export const enemies = {};

/**
 * 属性情報（attributes.json からロード）
 */
export const attributes = {};

/**
 * 距離減衰補正テーブル（range.json からロード）
 * rangeSelect の値に対応
 */
export const rangeTable = {};

/**
 * 属性相性補正テーブル（match.json からロード）
 * matchSelect の値に対応
 * - none: 等倍
 * - weak: 弱点（ダメージ増加）
 * - resist: 耐性（ダメージ減少）
 */
export const matchTable = {};

/**
 * ヘルプテキスト（helpTexts.json からロード）
 */
export const helpTexts = {};

/**
 * i18n 辞書（lang/*.json からロード）
 * UI の翻訳に使用
 */
export const i18nDict = {};
