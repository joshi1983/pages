import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const definiteStringTypes = new Set([
	ParseTreeTokenType.STRING_LITERAL
]);

export function isStringToken(token) {
	return definiteStringTypes.has(token.type);
};