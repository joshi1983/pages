import { addToken } from './addToken.js';
import { getGoodPreviousForDeclaration } from './getGoodPreviousForDeclaration.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processDeclaration(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.DOT)
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	else
		previousToken = getGoodPreviousForDeclaration(previousToken);
	addToken(previousToken, nextToken);
};