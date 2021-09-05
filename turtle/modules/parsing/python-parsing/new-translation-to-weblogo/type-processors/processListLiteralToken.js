import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { processToken } from './processToken.js';

export function processListLiteralToken(token, result, cachedParseTree) {
	const children = filterBracketsAndCommas(token.children);
	result.append('[');
	for (let i = 1; i < children.length - 1; i++) {
		if (i > 1)
			result.append(' ');
		processToken(children[i], result, cachedParseTree);
	}
	result.append(']');
};