import { isAmosHexLiteral } from './isAmosHexLiteral.js';

function convertAmosHexLiteralToQBasicHexLiteral(s) {
	return '&h' + s.substring(1);
}

export function amosHexNumberLiteralsToQBasicHexLiterals(scanTokens) {
	for (const token of scanTokens) {
		if (isAmosHexLiteral(token.s)) {
			token.s = convertAmosHexLiteralToQBasicHexLiteral(token.s);
		}
	}
};