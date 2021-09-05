import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function endsWithCurlyRightBracket(token) {
	if (token.children.length === 0)
		return false;
	return token.children[token.children.length - 1].type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
};