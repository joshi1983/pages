import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function endsWithClosingCurvedBracket(token) {
	if (token.children.length === 0)
		return false;
	return token.children[token.children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
};