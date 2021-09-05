import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processToken } from '../processToken.js';

export function processLinspace(token, result,
cachedParseTree, settings) {
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	result.append('(pyNumPyLinspace ');
	const maxIndex = Math.min(parameterValueTokens.length, 4);
	for (let i = 0; i < maxIndex; i++) {
		const child = parameterValueTokens[i];
		processToken(child, result, cachedParseTree, settings);
		result.append(' ');
	}
	// FIXME: if any default values are needed, process them.
	result.append(')');
};