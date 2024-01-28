import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';
import { getSortedFirstTokenFromArray } from './getSortedFirstTokenFromArray.js';

/*
getSortedFirstDescendentTokenOf is different from getFirstDescendentTokenOf in that
this will look at colIndex and lineIndex to determine which token is first.

This may return tokens which have children but getFirstDescendentTokenOf will never return a token with children.
*/
export function getSortedFirstDescendentTokenOf(token) {
	return getSortedFirstTokenFromArray(getAllDescendentsAsArray(token));
};