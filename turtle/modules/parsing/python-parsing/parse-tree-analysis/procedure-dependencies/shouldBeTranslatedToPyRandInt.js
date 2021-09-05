import { filterBracketsAndCommas } from '../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function shouldBeTranslatedToPyRandInt(cachedParseTree, randintToken) {
	if (randintToken.val !== 'randint' || randintToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const parameterValueTokens = filterBracketsAndCommas(randintToken.children);
	if (parameterValueTokens.length !== 2)
		return false; // no translation possible when there are no parameters.
	return true;
};