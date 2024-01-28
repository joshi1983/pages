import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function filterBracketsAndCommas(tokens) {
	return tokens.filter(token =>
		token.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET &&
		token.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET &&
		token.type !== ParseTreeTokenType.COMMA
	);
};