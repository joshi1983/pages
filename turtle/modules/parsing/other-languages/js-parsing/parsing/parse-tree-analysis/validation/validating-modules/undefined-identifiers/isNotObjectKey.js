import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function isNotObjectKey(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.COLON ||
	parent.children.indexOf(token) !== 0)
		return true;
	const grandParent = parent.parentNode;
	if (grandParent === null || grandParent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return true;
	return false;
};