import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processTokens } from
'../helpers/processTokens.js';

export function Color(token, result, settings) {
	const args = filterBracketsAndCommas(token.children[1].children);
	result.append(' [\n');
	processTokens(args, result, settings);
	for (let i = args.length; i < 3; i++) {
		result.append(' 0 ');
	}
	result.append('\n]\n');
};