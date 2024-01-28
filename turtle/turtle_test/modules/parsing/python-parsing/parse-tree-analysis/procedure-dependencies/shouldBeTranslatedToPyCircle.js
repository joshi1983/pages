import { filterBracketsAndCommas } from '../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { isNumber } from '../../../../isNumber.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function shouldBeTranslatedToPyCircle(cachedParseTree, circleToken) {
	if (circleToken.val !== 'circle' || circleToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false; // it isn't even a circle function call so of course not.
	const parameterValueTokens = filterBracketsAndCommas(circleToken.children);
	if (parameterValueTokens.length === 0)
		return false; // no translation possible when there are no parameters.
	if (parameterValueTokens.length === 1) {
		// if the radius is definitely positive, return false.
		const radiusToken = parameterValueTokens[0];
		const val = cachedParseTree.getTokenValues().get(radiusToken);
		if (isNumber(val) && val > 0)
			return false;
	}
	return true;
};