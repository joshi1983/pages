import { filterBracketsAndCommas } from
'../../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

export function ellipseMode(token, result, settings) {
	const argList = token.children[1];
	if (argList === undefined)
		return;

	const valTokens = filterBracketsAndCommas(argList.children);
	if (valTokens.length === 1) {
		const valToken = valTokens[0];
		if (valToken.type === ParseTreeTokenType.IDENTIFIER)
			result.append(`\nmake "ellipseMode ${valueToLiteralCode(valToken.val.toLowerCase())}`);
	}
};