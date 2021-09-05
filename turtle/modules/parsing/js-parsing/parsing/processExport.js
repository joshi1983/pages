import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
ParseTreeTokenType.FROM,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TEMPLATE_LITERAL
]);

function isGoodPrevious(token) {
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