import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const bracketTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

function isNotBracket(token) {
	return !bracketTypes.has(token.type);
}

export function filterOutBrackets(tokens) {
	return tokens.filter(isNotBracket);
};