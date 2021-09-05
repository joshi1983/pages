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
	const [x1,y1,width,height] = filterBracketsAndCommas(argList.children);

	result.append('\njumpTo [');
	processToken(x1, result, options);
	result.append(' ');
	processToken(y1, result, options);
	result.append(']\nrect ');
	processToken(width, result, options);
	result.append(' ');
	processToken(height, result, options);
	result.append('\n');
};

rect.isApplicableTo = isApplicable;