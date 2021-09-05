import { compareTokenLocations } from './compareTokenLocations.js';

export function getParseTokensSorted(allTokens) {
	allTokens.sort(compareTokenLocations);
};