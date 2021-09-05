import { filterBracketsAndCommas } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/processToken.js';

function isApplicable(token) {
	const argList = token.children[1];
	return filterBracketsAndCommas(argList.children).length === 4;
}

export function rect(token, result, options) {
	const argList = token.children[1];
	const [x1,y1,x2,y2] = filterBracketsAndCommas(argList.children);
	result.append('\nqbBox2 [');
	processToken(x1, result, options);
	result.append(' ');
	processToken(y1, result, options);
	result.append('] [');
	processToken(x2, result, options);
	result.append(' ');
	processToken(y2, result, options);
	result.append(']\n');
};

rect.isApplicableTo = isApplicable;