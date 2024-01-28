import { filterBracketsAndCommas } from '../../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { filterSquareBrackets } from '../../../translation-to-weblogo/type-processors/helpers/filterSquareBrackets.js';

export function getListLiteralValue(token, tokenValues) {
	const elementValueTokens = filterSquareBrackets(filterBracketsAndCommas(token.children));
	const result = [];
	for (let i = 0; i < elementValueTokens.length; i++) {
		const val = tokenValues.get(elementValueTokens[i]);
		if (val === undefined)
			return;
		else
			result.push(val);
	}
	return result;
};