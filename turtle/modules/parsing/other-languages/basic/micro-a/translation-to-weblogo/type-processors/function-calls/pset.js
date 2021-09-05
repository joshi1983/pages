import { filterBracketsAndCommas } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/processToken.js';

function isApplicable(token) {
	const argList = token.children[1];
	return filterBracketsAndCommas(argList.children).length === 2;
}

export function pset(token, result, options) {
	const argList = token.children[1];
	const [x,y] = filterBracketsAndCommas(argList.children);
	result.append('\npset1 [ ');
	processToken(x, result, options);
	result.append(' ');
	processToken(y, result, options);
	result.append(' ]\n');
};

pset.isApplicableTo = isApplicable;