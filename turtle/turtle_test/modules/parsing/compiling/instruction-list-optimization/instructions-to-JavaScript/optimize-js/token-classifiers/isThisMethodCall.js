import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isThisMethodCall(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.children.length !== 0)
		return false;
	token = token.parentNode;
	if (token.type !== ParseTreeTokenType.DOT || token.val !== '.')
		return false;
	token = token.parentNode;
	if (token.type !== ParseTreeTokenType.THIS)
		return false;
	token = token.parentNode;
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	return true;
};