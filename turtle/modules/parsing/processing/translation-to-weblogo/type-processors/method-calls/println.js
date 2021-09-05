import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';

export function println(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but got ${settings}`);
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		for (let i = 0; i < args.length - 1; i++) {
			result.append('\ntype ');
			processToken(args[i], result, settings);
		}
		result.append('\nprint ');
		processToken(args[args.length - 1], result, settings);
		result.append('\n');
	}
};