import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

function isFontCall(token) {
	if (token.type !== ParseTreeTokenType.FUNC_CALL)
		return false;
	const nameToken = token.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.val !== 'Font')
		return false;
	return true;
}

export function setPenFont(token, result, settings) {
	let args = filterBracketsAndCommas(token.children[1].children);
	if (args.length === 1) {
		const child = args[0];
		if (isFontCall(child)) {
			args = filterBracketsAndCommas(child.children[1].children);
			if (args.length === 2) {
				result.append('\nsetFontFamily ');
				processToken(args[0], result, settings);
				result.append('\nsetFontSize ');
				processToken(args[1], result, settings);
				result.append('\n');
			}
		}
		else {
			result.append('\nkojoSetPenFont ');
			processToken(args[0], result, settings);
			result.append('\n');
		}
	}
};