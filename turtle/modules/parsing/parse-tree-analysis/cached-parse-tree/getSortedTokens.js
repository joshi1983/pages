import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';

export function getSortedTokens(cachedParseTree) {
	if (cachedParseTree.sortedTokens === undefined) {
		cachedParseTree.sortedTokens = cachedParseTree.getAllTokens();
		getParseTokensSorted(cachedParseTree.sortedTokens);
	}
	return cachedParseTree.sortedTokens;
};