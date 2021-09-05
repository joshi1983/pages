import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.NUMBER_LITERAL
]);

function isGoodPrevious(token) {
	if (badPreviousTypes.has(token.type))
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processNumberLiteral(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (previousToken.type === ParseTreeTokenType.VARIABLE_REFERENCE) {
		previousToken.type = ParseTreeTokenType.INSTRUCTION;
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};