import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isIdentifier } from './isIdentifier.js';
import { mayBeAdjacent } from '../../generic-parsing-utilities/mayBeAdjacent.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

function plusMinusSanitizer(tokens, index) {
	const token = tokens[index];
	const prevToken = tokens[index - 1];
	if (!mayBeAdjacent(prevToken, token))
		return;
	if (!isCompleteNumberLiteral(token.s))
		return;
	const ch = token.s.charAt(0);
	if ((ch === '+' || ch === '-') && prevToken !== undefined &&
	(isCompleteNumberLiteral(prevToken.s) || prevToken.s === ')' || isIdentifier(prevToken.s))) {
		const operatorToken = new Token(ch, prevToken.colIndex + 1, prevToken.lineIndex);
		tokens.splice(index, 0, operatorToken);
		token.s = token.s.substring(1);
	}
}

const sanitizers = [
plusMinusSanitizer,
];

export function sanitizeTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		for (let s = 0; s < sanitizers.length; s++) {
			sanitizers[s](tokens, i);
		}
	}
};