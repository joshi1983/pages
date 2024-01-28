import { getSortedTokenIndex } from '../../parse-tree-analysis/cached-parse-tree/getSortedTokenIndex.js';
import { getSortedTokens } from '../../parse-tree-analysis/cached-parse-tree/getSortedTokens.js';

/*
extraCondition is optional.
	If specified, this will keep iterating through next tokens until finding one where extraCondition(theToken) === true.

Returns undefined if no next token is found.
*/
export function getNextToken(cachedParseTree, token, extraCondition) {
	const sortedTokens = getSortedTokens(cachedParseTree);
	const tokenIndex = getSortedTokenIndex(cachedParseTree, token);
	if (extraCondition === undefined)
		return sortedTokens[tokenIndex + 1];
	for (let i = tokenIndex + 1; i < sortedTokens.length; i++) {
		const token2 = sortedTokens[i];
		if (extraCondition(token2))
			return token2;
	}
};