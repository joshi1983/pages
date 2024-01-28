import { binarySearch } from '../../../../binarySearch.js';
import { compareTokenLocations } from '../../../../parsing/parse-tree-token/compareTokenLocations.js';

/*
Make sure the sortedTokens are sorted.
getParseTokensSorted will do the trick.
*/
export function getTokenBefore(sortedTokens, token) {
	let index = binarySearch(sortedTokens, compareTokenLocations, token, true);
	if (index < 0)
		index = 0;
	if (index >= 0 && index < sortedTokens.length) {
		let comparisonResult = compareTokenLocations(sortedTokens[index], token);
		if (comparisonResult >= 0)
			index--;
		if (index >= 0 && index < sortedTokens.length)
			return sortedTokens[index];
	}
};