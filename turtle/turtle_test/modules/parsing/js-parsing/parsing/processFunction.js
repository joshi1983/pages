import { addToken } from './addToken.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const appendChildTypes = new Set([
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.TREE_ROOT
]);

const appendSiblingTypes = new Set([
	ParseTreeTokenType.FUNCTION
]);

function shouldAppendChild(previousToken) {
	if (appendChildTypes.has(previousToken.type))
		return true;
	return false;
}

function getGoodPreviousToken(token) {
	if (token.type === ParseTreeTokenType.CODE_BLOCK &&
	token.parentNode.type === ParseTreeTokenType.FUNCTION &&
	endsWithCurlyRightBracket(token))
		return token.parentNode;
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