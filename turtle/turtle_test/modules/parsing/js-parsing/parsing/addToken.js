import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { isDontAddNextSiblingType } from './isDontAddNextSiblingType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

export function addToken(previousToken, nextToken) {
	const expectedNumberOfChildren = getExpectedChildrenLengthForToken(previousToken);
	if (expectedNumberOfChildren !== undefined && expectedNumberOfChildren > previousToken.children.length)
		previousToken.appendChild(nextToken);
	else if (expectedNumberOfChildren === 0)
		previousToken.appendSibling(nextToken);
	else if (shouldAppendChild(previousToken, nextToken))
		previousToken.appendChild(nextToken);
	else if (isDontAddNextSiblingType(previousToken.type))
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
};