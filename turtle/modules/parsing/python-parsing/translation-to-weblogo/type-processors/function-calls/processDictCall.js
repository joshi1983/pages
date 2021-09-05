import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';

export function processDictCall(token, result, cachedParseTree) {
	const parameterTokens = filterBracketsAndCommas(token.children);
	if (parameterTokens.length === 0) {
		result.append('createPList');
	}
	else
		return false;
};