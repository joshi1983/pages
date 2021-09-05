import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isArgListToConvertToExpression(token) {
	if (token.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const children = token.children;
	const firstChild = children[0];
	if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false;
	const lastChild = children[children.length - 1];
	return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
};