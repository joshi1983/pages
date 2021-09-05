import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { processToken } from '../processToken.js';

export function processTupleLiteralToken(token, result, cachedParseTree) {
	const children = filterBracketsAndCommas(token.children);
	result.append('[');
	for (let i = 0; i < children.length; i++) {
		if (i > 0)
			result.append(' ');
		const child = children[i];
		processToken(child, result, cachedParseTree);
	}
	result.append(']');
};