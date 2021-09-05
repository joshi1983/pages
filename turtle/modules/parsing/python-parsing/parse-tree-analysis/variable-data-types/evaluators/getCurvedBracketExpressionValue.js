import { filterBracketsAndCommas } from '../../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';

export function getCurvedBracketExpressionValue(token, tokenValues) {
	const childValueTokens = filterBracketsAndCommas(token.children);
	if (childValueTokens.length === 1)
		return tokenValues.get(childValueTokens[0]);
};