import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const prevTypes = new Set([
	ParseTreeTokenType.IF,
]);

function getGoodPrevious(token) {
	while (token.parentNode !== null && !prevTypes.has(token.type))
		token = token.parentNode;
	return token;
}

export function processElse(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};