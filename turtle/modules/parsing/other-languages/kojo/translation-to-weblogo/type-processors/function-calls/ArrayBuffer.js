import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processTokens } from
'../helpers/processTokens.js';

export function ArrayBuffer(token, result, settings) {
	const args = filterBracketsAndCommas(token.children[1].children);
	result.append(' [\n');
	processTokens(args, result, settings);
	result.append('\n]\n');
};