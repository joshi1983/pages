import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isCompleteArrowFunctionExpression(token) {
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length === 3)
		return isCompleteArrowFunctionExpression(token.children[1]);
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.val === '=>' && token.children.length === 2)
		return true;
	return false;
};