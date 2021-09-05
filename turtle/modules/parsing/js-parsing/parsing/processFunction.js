import { addToken } from './addToken.js';
import { declaringTypes } from './declaringTypes.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const appendChildTypes = new Set([
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.TREE_ROOT
]);

const appendSiblingTypes = new Set([
	ParseTreeTokenType.FUNCTION
]);
const badPreviousTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL
]);
SetUtils.addAll(badPreviousTypes, declaringTypes);

function shouldAppendChild(previousToken) {
	if (appendChildTypes.has(previousToken.type))
		return true;
	return false;
}

function isBadPreviousToken(token) {
	if (token.parentNode === null)
		return false;
	if (token.type === ParseTreeTokenType.EXPORT &&
	token.children.length === 1)
		return true;
	if (token.type === ParseTreeTokenType.CODE_BLOCK &&
	token.parentNode.type === ParseTreeTokenType.FUNCTION &&
	endsWithCurlyRightBracket(token))
		return true;
	if (badPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPreviousToken(token) {
	while (isBadPreviousToken(token))
		token = token.parentNode;
	return token;
}

export function processFunction(previousToken, nextToken) {
	previousToken = getGoodPreviousToken(previousToken);
	if (shouldAppendChild(previousToken))
		previousToken.appendChild(nextToken);
	else if (appendSiblingTypes.has(previousToken.type))
		previousToken.appendSibling(nextToken);
	else
		addToken(previousToken, nextToken);
};