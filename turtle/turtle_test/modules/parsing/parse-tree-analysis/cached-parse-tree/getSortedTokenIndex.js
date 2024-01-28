import { binarySearch } from '../../../binarySearch.js';
import { compareTokenLocations } from '../../parse-tree-token/compareTokenLocations.js';
import { getSortedTokens } from './getSortedTokens.js';

export function getSortedTokenIndex(cachedParseTree, token) {
	const result = binarySearch(getSortedTokens(cachedParseTree), compareTokenLocations, token);
	if (typeof result === 'object')
		return -1; // indicate not found.
	return result;
};