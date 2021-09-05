import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const badValueTokenTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

function isValueToken(token) {
	if (badValueTokenTypes.has(token.type))
		return false;
	return true;
}

export function filterParameterValueTokens(tokens) {
	return tokens.filter(isValueToken);
};