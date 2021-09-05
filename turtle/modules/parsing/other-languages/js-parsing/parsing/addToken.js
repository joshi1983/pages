import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { isDontAddNextSiblingType } from './isDontAddNextSiblingType.js';
import { isValidIdentifierPrefix } from '../scanning/isValidIdentifierPrefix.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

function isAppendingChild(previousToken, nextToken) {
	const expectedNumberOfChildren = getExpectedChildrenLengthForToken(previousToken);
	if (expectedNumberOfChildren !== undefined && expectedNumberOfChildren > previousToken.children.length)
		return true;
	else if (expectedNumberOfChildren === 0)
		return false;
	else if (shouldAppendChild(previousToken, nextToken))
		return true;
	else if (isDontAddNextSiblingType(previousToken.type))
		return true;
	else
		return false;
}

export function addToken(previousToken, nextToken) {
	const appending = isAppendingChild(previousToken, nextToken);
	if (appending && previousToken.type === ParseTreeTokenType.DOT &&
	isValidIdentifierPrefix(nextToken.val)) {
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	}
	if (appending)
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
};