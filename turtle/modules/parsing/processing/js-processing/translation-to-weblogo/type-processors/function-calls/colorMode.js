import { filterBracketsAndCommas } from
'../../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

export function colorMode(token, result, settings) {
	const argList = token.children[1];
	if (argList === undefined)
		return;

	const valTokens = filterBracketsAndCommas(argList.children);
	if (valTokens.length !== 0) {
		const modeNameToken = valTokens[0];
		if (modeNameToken.type === ParseTreeTokenType.IDENTIFIER)
			result.append(`\nmake "colorMode ${valueToLiteralCode(modeNameToken.val.toLowerCase())}\n`);
	}
	if (valTokens.length === 2) {
		result.append('\nmake "colorMax ');
		processToken(valTokens[1], result, settings);
		result.append('\n');
	}
};