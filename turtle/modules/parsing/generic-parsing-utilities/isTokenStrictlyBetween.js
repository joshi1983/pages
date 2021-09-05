import { isStrictlyAfter } from './isStrictlyAfter.js';

export function isTokenStrictlyBetween(token, from, to) {
	if (!isStrictlyAfter(token, from))
		return false;
	if (!isStrictlyAfter(to, token))
		return false;
	return true;
};