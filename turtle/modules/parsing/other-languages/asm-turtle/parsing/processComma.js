import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
ParseTreeTokenType.COLON,
ParseTreeTokenType.COMMA,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.VARIABLE_REFERENCE
]);

function getGoodPrevious(token) {
	while (token.parentNode !== null && badPreviousTypes.has(token.type))
		token = token.parentNode;
	return token;
}

export function processComma(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};