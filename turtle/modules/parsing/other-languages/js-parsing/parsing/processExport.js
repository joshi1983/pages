import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CONST,
ParseTreeTokenType.FROM,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TEMPLATE_LITERAL,
ParseTreeTokenType.VAR
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (badPreviousTypes.has(token.type))
		return false;
	return true;
}

function getGoodPreviousToken(previousToken) {
	while (!isGoodPrevious(previousToken)) {
		previousToken = previousToken.parentNode;
	}
	return previousToken;
}

export function processExport(previousToken, nextToken) {
	previousToken = getGoodPreviousToken(previousToken);
	addToken(previousToken, nextToken);
};