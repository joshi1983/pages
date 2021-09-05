import { filterBracketsAndCommas } from '../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function shouldBeTranslatedToPyRandRange(cachedParseTree, randrangeToken) {
	if (randrangeToken.val !== 'randrange' || randrangeToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const parameterValueTokens = filterBracketsAndCommas(randrangeToken.children);
	if (parameterValueTokens.length !== 2)
		return false;
	return true;
};