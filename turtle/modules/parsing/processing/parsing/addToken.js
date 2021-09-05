import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { isDontAddNextSiblingType } from './isDontAddNextSiblingType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';
import { isValidIdentifierPrefix } from '../scanning/isValidIdentifierPrefix.js';

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
	if (nextToken.type !== ParseTreeTokenType.DOT) {
		if (previousToken.type === ParseTreeTokenType.IMPORT &&
		nextToken.type !== ParseTreeTokenType.IDENTIFIER &&
		previousToken.children.length === 0 &&
		isValidIdentifierPrefix(nextToken.val)) {
			nextToken.type = ParseTreeTokenType.IDENTIFIER;
			previousToken.appendChild(nextToken);
		}
		else if (previousToken.type !== ParseTreeTokenType.IMPORT &&
		(previousToken.type !== ParseTreeTokenType.DOT ||
		previousToken.children.length !== 0)) {
			const importToken = getClosestOfType(previousToken, ParseTreeTokenType.IMPORT);
			if (importToken !== null && importToken.children.length !== 0) {
				previousToken = importToken.parentNode;
			}
		}
	}
	const appendChild = isAppendingChild(previousToken, nextToken);
	if (appendChild && previousToken.type === ParseTreeTokenType.DOT)
		nextToken.type = ParseTreeTokenType.IDENTIFIER;
	if (appendChild)
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
};