import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';

export function processDictCall(token, result, cachedParseTree) {
	const argList = token.children[0];
	if (argList === undefined)
		return false;
	const parameterTokens = filterBracketsAndCommas(argList.children);
	if (parameterTokens.length === 0) {
		result.append('createPList');
	}
	else
		return false;
};