import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { declaringTypes } from './declaringTypes.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DECLARATION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);
SetUtils.addAll(badPreviousTypes, declaringTypes);

function isBadPrevious(previousToken) {
	if (badPreviousTypes.has(previousToken.type))
		return true;
	return false;
}

function getGoodPrevious(previousToken) {
	while (isBadPrevious(previousToken))
		previousToken = previousToken.parentNode;

	return previousToken;
}

export function processFor(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	previousToken = getGoodPrevious(previousToken);
	addToken(previousToken, nextToken);
};