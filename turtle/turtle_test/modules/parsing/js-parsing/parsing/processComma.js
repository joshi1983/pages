import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { getClosestOfTypes } from '../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypesArray = [
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, // For example, {"x": 1, "y": 2}

	ParseTreeTokenType.LET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.VAR
];
const goodPreviousTypes = new Set(goodPreviousTypesArray);

function isGoodPreviousToken(token) {
	// needed because some argument lists are of type CURVED_BRACKET_EXPRESSION until the => operator gets processed.
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	token.type === ParseTreeTokenType.ARG_LIST) {
		return !endsWithClosingCurvedBracket(token);
	}
	if (token.type === ParseTreeTokenType.ARRAY_LITERAL &&
	endsWithSquareRightBracket(token))
		return false;

	return goodPreviousTypes.has(token.type);
}

function getGoodPreviousToken(token) {
	//return getClosestOfTypes(token, goodPreviousTypesArray);
	while (token.parentNode !== null && !isGoodPreviousToken(token))
		token = token.parentNode;
	return token;
}

export function processComma(previousToken, nextToken) {
	previousToken = getGoodPreviousToken(previousToken);
	previousToken.appendChild(nextToken);
};