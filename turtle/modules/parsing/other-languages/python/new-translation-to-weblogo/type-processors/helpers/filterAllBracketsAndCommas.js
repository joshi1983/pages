import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const filteredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

export function filterAllBracketsAndCommas(tokens) {
	return tokens.filter(t => !filteredTypes.has(t.type));
};