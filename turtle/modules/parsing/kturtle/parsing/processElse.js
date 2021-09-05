import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processElse(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.CODE_BLOCK &&
	previousToken.parentNode !== null &&
	previousToken.parentNode.type === ParseTreeTokenType.IF)
		previousToken = previousToken.parentNode;
	previousToken.appendChild(nextToken);
	return nextToken;
};