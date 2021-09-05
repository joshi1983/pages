import { createTokenFromToken } from './createTokenFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesExpectingCurvedLeftBracket = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION
]);

function getNewTokenType(prev) {
	if (prev.type === ParseTreeTokenType.CLASS)
		return ParseTreeTokenType.ARGUMENT_LIST;

	if (typesExpectingCurvedLeftBracket.has(prev.type) &&
	prev.children.length === 0)
		return;

	return ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
}

export function processCurvedLeftBracket(prev, next) {
	const newTokenType = getNewTokenType(prev);
	if (newTokenType !== undefined) {
		const newToken = createTokenFromToken(null, next, newTokenType);
		prev.appendChild(newToken);
		prev = newToken;
	}
	prev.appendChild(next);
	return prev;
};