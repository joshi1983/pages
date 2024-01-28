import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processIdentifier } from './processIdentifier.js';

const previousTypesForDeleteIdentifiers = new Set([
	ParseTreeTokenType.DOT
]);

function shouldDeleteBecomeIdentifier(previousToken) {
	if (previousTypesForDeleteIdentifiers.has(previousToken.type))
		return true;
	return false;
}

export function processDelete(previousToken, nextToken) {
	if (shouldDeleteBecomeIdentifier(previousToken)) {
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
		processIdentifier(previousToken, nextToken);
	}
	else
		addToken(previousToken, nextToken);
};