import { isAfterOrSame } from './isAfterOrSame.js';

export function compareTokenLocations(token1, token2) {
	if (isAfterOrSame(token1, token2)) {
		if (token1.lineIndex === token2.lineIndex && token1.colIndex === token2.colIndex)
			return 0;
		else
			return 1;
	}
	else
		return -1;
};