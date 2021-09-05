import { compareTokenLocations } from './compareTokenLocations.js';

/* Note that this sorts in-place instead of returning the resulting Array.  */
export function getParseTokensSorted(allTokens) {
	allTokens.sort(compareTokenLocations);
};