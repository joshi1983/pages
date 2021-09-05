import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { processToken } from './processToken.js';

export function processCodeBlock(token, result, settings) {
	const children = filterBracketsAndCommas(token.children);
	for (const child of children) {
		result.processCommentsUpToToken(child);
		processToken(child, result, settings);
		result.append('\n');
	}
};