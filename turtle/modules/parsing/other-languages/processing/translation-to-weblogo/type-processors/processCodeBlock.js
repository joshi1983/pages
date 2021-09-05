import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { processToken } from './processToken.js';

export function processCodeBlock(token, result, settings, wrapWithBrackets) {
	if (wrapWithBrackets === undefined)
		wrapWithBrackets = true;
	const children = filterBracketsAndCommas(token.children);
	if (wrapWithBrackets)
		result.append(' [\n');
	for (const child of children) {
		result.processCommentsUpToToken(child);
		processToken(child, result, settings);
		result.append('\n');
	}
	if (wrapWithBrackets)
		result.append('\n]\n');
};