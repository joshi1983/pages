import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isMethodCallToken(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL ||
	token.parentNode === null)
		return false;
	if (token.parentNode.type !== ParseTreeTokenType.DOT)
		return false;
	return true;
};