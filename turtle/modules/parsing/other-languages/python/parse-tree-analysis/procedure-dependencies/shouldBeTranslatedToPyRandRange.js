import { filterBracketsAndCommas } from '../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function shouldBeTranslatedToPyRandRange(cachedParseTree, randrangeToken) {
	if (randrangeToken.val !== 'randrange' || randrangeToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	let children = randrangeToken.children;
	if (children.length === 1 && children[0].type === ParseTreeTokenType.ARGUMENT_LIST)
		children = children[0].children;
	const parameterValueTokens = filterBracketsAndCommas(children);
	if (parameterValueTokens.length !== 2)
		return false;
	return true;
};