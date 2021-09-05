import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isPropertyToken(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (parent.type === ParseTreeTokenType.DOT)
		return true;
	if (parent.type !== ParseTreeTokenType.EXPRESSION_DOT)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent === null || grandParent.type !== ParseTreeTokenType.DOT)
		return false;
	return true;
};