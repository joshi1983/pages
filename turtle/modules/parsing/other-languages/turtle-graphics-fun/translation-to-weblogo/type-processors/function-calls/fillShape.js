import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processToken.js';

export function isFillShapeApplicableTo(token) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	return args.length === 1;
}

export function fillShape(token, result, options) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	result.append('\nsetFillColor ');
	processToken(args[0], result, options);
	result.append('\npolyEnd\n');
};