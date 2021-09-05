import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function shouldBeConvertedToDataType(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (token.children.length === 0 ||
	token.children[0].type !== ParseTreeTokenType.DOT)
		return true;
	return false;
};