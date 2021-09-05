import { isCompleteNumberLiteral } from
'./isCompleteNumberLiteral.js';
import { isIdentifier } from
'./isIdentifier.js';
import { Token } from
'../../Token.js';

function splitAroundPlusMinusSign(tokens, i) {
	const prev = tokens[i - 1];
	const token = tokens[i];
	if (prev !== undefined &&
	(isIdentifier(prev.s) || isCompleteNumberLiteral(prev.s)) &&
	token.s.length > 1 &&
	(token.s[0] === '-' || token.s[0] === '+') &&
	isCompleteNumberLiteral(token.s)) {
		const operatorToken = new Token(token.s[0], token.colIndex + 1 - token.s.length, token.lineIndex);
		tokens.splice(i, 0, operatorToken);
		token.s = token.s.substring(1);		
	}
}

const sanitizers = [
	splitAroundPlusMinusSign
];

export function sanitizeTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		for (const sanitize of sanitizers) {
			sanitize(tokens, i);
		}
	}
};