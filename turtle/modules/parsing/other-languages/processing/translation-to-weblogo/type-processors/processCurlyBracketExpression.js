import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { processToken } from './processToken.js';

export function processCurlyBracketExpression(token, result, settings) {
	const children = filterBracketsAndCommas(token.children);
	result.append('[ ');
	for (const child of children) {
		processToken(child, result, settings);
	}
	result.append(' ]');
};