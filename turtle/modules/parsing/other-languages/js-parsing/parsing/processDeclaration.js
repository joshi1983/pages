import { addToken } from './addToken.js';
import { getGoodPreviousForDeclaration } from './getGoodPreviousForDeclaration.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextBecomesIdentifierTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.VAR
]);

const bracketTypes = new Set([
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET
]);

function shouldNextbecomeIdentifier(previousToken, nextToken) {
	if (previousToken.children.length <= 1 &&
	(previousToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	previousToken.type === ParseTreeTokenType.ARG_LIST))
		return true;
	if (previousToken.children.length === 0)
		return nextBecomesIdentifierTypes.has(previousToken.type);

	return false;
}

export function processDeclaration(previousToken, nextToken) {
	while (previousToken.parentNode !== null && bracketTypes.has(previousToken.type))
		previousToken = previousToken.parentNode;

	if (shouldNextbecomeIdentifier(previousToken, nextToken))
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	else
		previousToken = getGoodPreviousForDeclaration(previousToken);
	addToken(previousToken, nextToken);
};