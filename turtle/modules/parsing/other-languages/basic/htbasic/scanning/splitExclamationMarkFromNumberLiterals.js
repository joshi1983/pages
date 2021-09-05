import { isNumberLiteral } from
'./isNumberLiteral.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

function isOfInterest(tokens, i) {
	const token = tokens[i];
	const s = token.s;
	if (s.length > 1 && s.endsWith('!'))
		return isNumberLiteral(s.substring(0, s.length - 1));

	return false;
}

export function splitExclamationMarkFromNumberLiterals(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			const token = tokens[i];
			token.s = token.s.substring(0, token.s.length - 1);
			const newToken = new Token('!', token.colIndex, token.lineIndex);
			token.colIndex--;
			tokens.splice(i + 1, 0, newToken);
		}
	}
};