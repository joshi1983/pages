import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function endsWithSquareRightBracket(token) {
	if (token.children.length === 0)
		return false;
	return token.children[token.children.length - 1].type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET;
};