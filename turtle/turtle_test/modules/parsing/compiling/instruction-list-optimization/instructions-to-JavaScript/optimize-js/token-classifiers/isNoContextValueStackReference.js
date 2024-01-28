import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isNoContextValueStackReference(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type === ParseTreeTokenType.DOT)
		return false;
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'valueStack' || token.children.length > 1)
		return false;
	return true;
};