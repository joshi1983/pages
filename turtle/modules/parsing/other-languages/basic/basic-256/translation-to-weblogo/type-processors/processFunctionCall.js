import { filterBracketsAndCommas } from
'../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

export function isApplicableTo(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined)
		return false;
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.val.toLowerCase() !== 'clear')
		return false;
	const argList = token.children[1];
	if (argList !== undefined) {
		const children = filterBracketsAndCommas(argList.children);
		// some arguments means it isn't a good match for WebLogo's transparent.
		if (children.length !== 0)
			return false;
	}
	return true;
}

export function processFunctionCall(token, result, options) {
	result.append(' transparent ');
};