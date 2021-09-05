import { filterBracketsAndCommas } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';

export function getFilteredArgs(token) {
	const argList = token.children[1];
	return filterBracketsAndCommas(argList.children);
};