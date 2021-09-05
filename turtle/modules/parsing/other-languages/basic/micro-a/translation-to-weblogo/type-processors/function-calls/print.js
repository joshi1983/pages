import { filterBracketsAndCommas } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/processToken.js';

function isApplicable(token) {
	const argList = token.children[1];
	return filterBracketsAndCommas(argList.children).length === 3;
}

export function print(token, result, options) {
	const argList = token.children[1];
	const [x,y,s] = filterBracketsAndCommas(argList.children);
	result.append('\nma_print ');
	processToken(x, result, options);
	result.append(' ');
	processToken(y, result, options);
	result.append(' ');
	processToken(s, result, options);
	result.append('\n');
};

print.isApplicableTo = isApplicable;