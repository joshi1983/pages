import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const identifierPreviousTypes = new Set([
ParseTreeTokenType.DOT,
ParseTreeTokenType.EXPRESSION_DOT,
]);

export function processAsync(previousToken, nextToken) {
	if (identifierPreviousTypes.has(previousToken.type))
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	addToken(previousToken, nextToken);
};