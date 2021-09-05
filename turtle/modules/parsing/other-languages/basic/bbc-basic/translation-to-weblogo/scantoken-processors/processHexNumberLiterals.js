import { isHexNumberLiteral } from
'../../scanning/isHexNumberLiteral.js';

function bbcBasicHexToQBasicHex(s) {
	if (s[0] === '&')
		return '&H' + s.substring(1);
	return s;
}

export function processHexNumberLiterals(tokens) {
	for (const token of tokens) {
		if (isHexNumberLiteral(token.s)) {
			token.s = bbcBasicHexToQBasicHex(token.s);
		}
	}
};