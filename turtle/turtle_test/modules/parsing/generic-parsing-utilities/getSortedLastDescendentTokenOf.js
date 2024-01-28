import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';
import { isAfterOrSame } from './isAfterOrSame.js';

export function getSortedLastDescendentTokenOf(token) {
	const tokens = getAllDescendentsAsArray(token);
	let result = token;
	for (let i = 0; i < tokens.length; i++) {
		if (isAfterOrSame(tokens[i], result))
			result = tokens[i];
	}
	return result;
};