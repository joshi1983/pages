import { Colour } from
'../../../../../Colour.js';
import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { isNumber } from
'../../../../../isNumber.js';
import { processTokens } from
'../helpers/processTokens.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

export function Color(token, result, settings) {
	const args = filterBracketsAndCommas(token.children[1].children);
	if (args.length === 3) {
		const vals = args.map(evaluateToken);
		if (!vals.some(v => !isNumber(v))) {
			result.append(' ' + valueToLiteralCode(new Colour(vals).to6DigitHTMLCode()) + ' ');
			return;
		}
	}
	result.append(' [\n');
	processTokens(args, result, settings);
	for (let i = args.length; i < 3; i++) {
		result.append(' 0 ');
	}
	result.append('\n]\n');
};