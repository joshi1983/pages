import { filterBracketsAndCommas } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/processToken.js';

function isApplicable(token) {
	const argList = token.children[1];
	return filterBracketsAndCommas(argList.children).length === 3;
}

export function circle(token, result, options) {
	const argList = token.children[1];
	const [x,y,radius] = filterBracketsAndCommas(argList.children);
	result.append('\njumpTo [');
	processToken(x, result, options);
	result.append(' ');
	processToken(y, result, options);
	result.append(']\ncircle ');
	processToken(radius, result, options);
};

circle.isApplicableTo = isApplicable;