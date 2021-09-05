import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function isIdentifierFromFunctionName(token) {
	const parentToken = token.parentNode;
	if (parentToken.type !== ParseTreeTokenType.FUNCTION)
		return false;
	return parentToken.children.indexOf(token) === 0;
};