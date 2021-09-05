import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function isIdentifierFromClassName(token) {
	const parentToken = token.parentNode;
	if (parentToken.type !== ParseTreeTokenType.CLASS)
		return false;
	return parentToken.children.indexOf(token) === 0;
};