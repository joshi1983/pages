import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';
import { isAfterOrSame } from './isAfterOrSame.js';

/*
getSortedFirstDescendentTokenOf is different from getFirstDescendentTokenOf in that
this will look at colIndex and lineIndex to determine which token is first.

This may return tokens which have children but getFirstDescendentTokenOf will never return a token with children.
*/
export function getSortedFirstDescendentTokenOf(token) {
	const tokens = getAllDescendentsAsArray(token);
	let result = token;
	for (let i = 0; i < tokens.length; i++) {
		if (isAfterOrSame(result, tokens[i]))
			result = tokens[i];
	}
	return result;
};