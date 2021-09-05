import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function filterSquareBrackets(tokens) {
	return tokens.filter(token =>
		token.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET &&
		token.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET &&
		token.type !== ParseTreeTokenType.COMMA
	);
};