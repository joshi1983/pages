import { addToken } from './addToken.js';
import { getClosestOfTypes } from '../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const appendChildTypes = new Set([
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.IF,
]);

function getGoodPrevious(token) {
	const lastChild = token.children[token.children.length - 1];
	if (lastChild !== undefined && appendChildTypes.has(lastChild.type))
		return lastChild;
	const result = getClosestOfTypes(token, [ParseTreeTokenType.ELSE_IF, ParseTreeTokenType.IF]);
	if (result === null)
		return token;
	return result;
}

export function processElse(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (appendChildTypes.has(previousToken.type))
		previousToken.appendChild(nextToken);
	else {
		addToken(previousToken, nextToken);
	}
};