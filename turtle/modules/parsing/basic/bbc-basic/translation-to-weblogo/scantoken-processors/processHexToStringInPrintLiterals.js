import { isHexToStringLiteral } from
'../../scanning/isHexToStringLiteral.js';

function convertToStringLiteral(s) {
	s = s.substring(2);
	return `"${s.toUpperCase()}"`;
}

export function processHexToStringInPrintLiterals(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isHexToStringLiteral(token.s))
			token.s = convertToStringLiteral(token.s);
	}
};