import { isAfterOrSame } from './isAfterOrSame.js';

export function getSortedFirstTokenFromArray(tokens) {
	let result = tokens[0];
	for (let i = 1; i < tokens.length; i++) {
		if (isAfterOrSame(result, tokens[i]))
			result = tokens[i];
	}
	return result;
};