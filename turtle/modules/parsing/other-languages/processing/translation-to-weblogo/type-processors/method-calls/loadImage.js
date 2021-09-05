import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';

export function loadImage(token, result, settings) {
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		if (args.length === 1)
			processToken(args[0], result, settings);
	}
};