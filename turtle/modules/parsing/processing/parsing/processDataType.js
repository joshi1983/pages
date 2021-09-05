import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processDataType(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.NEW)
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	addToken(previousToken, nextToken);
};