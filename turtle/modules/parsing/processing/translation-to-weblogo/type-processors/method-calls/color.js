import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processArgumentsAsSingleColor } from
'./processArgumentsAsSingleColor.js';

export function color(token, result, settings) {
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		processArgumentsAsSingleColor(args, result, settings);
	}
};