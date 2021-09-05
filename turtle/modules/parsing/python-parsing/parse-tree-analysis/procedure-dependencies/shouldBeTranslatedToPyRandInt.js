import { filterBracketsAndCommas } from '../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function shouldBeTranslatedToPyRandInt(cachedParseTree, randintToken) {
	if (randintToken.val !== 'randint' || randintToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	let children = randintToken.children;
	if (children.length === 1 && children[0].type === ParseTreeTokenType.ARGUMENT_LIST)
		children = children[0].children;
	const parameterValueTokens = filterBracketsAndCommas(children);
	if (parameterValueTokens.length !== 2)
		return false; // no translation possible when there are no parameters.
	return true;
};