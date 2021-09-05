import { isAfterOrSame } from './isAfterOrSame.js';
import { compareTokenLocations } from './compareTokenLocations.js';

export function getParseTokensSorted(allTokens) {
	allTokens.sort(compareTokenLocations);
};