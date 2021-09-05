import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processClass(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.DOT)
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	addToken(previousToken, nextToken);
};