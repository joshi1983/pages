import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isCompletePseudoClass } from './isCompletePseudoClass.js';
import { mayBeAdjacent } from '../../generic-parsing-utilities/mayBeAdjacent.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

function plusMinusSanitizer(tokens, index) {
	if (index === 0)
		return;
	const token = tokens[index];
	const prevToken = tokens[index - 1];
	if (!mayBeAdjacent(prevToken, token))
		return;
	if (prevToken.s === '(' || prevToken.s === ',')
		return;
	const ch = token.s.charAt(0);
	if (ch !== '-' && ch !== '+')
		return;
	if (!isCompleteNumberLiteral(token.s.substring(1)))
		return;
	const operatorToken = new Token(ch, prevToken.colIndex + 1, prevToken.lineIndex);
	tokens.splice(index, 0, operatorToken);
	token.s = token.s.substring(1);
}

function pseudoClassSanitizer(tokens, index) {
	const token = tokens[index];
	if (token.s[0] !== ':' || (token.s.length <= 2 && token.s.endsWith(':')))
		return;
	if (!isCompletePseudoClass(token.s)) {
		let prefix = token.s[0];
		if (token.s.startsWith('::'))
			prefix = '::';
		const prevColIndex = token.colIndex - token.s.length + prefix.length;
		const prevLineIndex = token.lineIndex;
		const prevToken = new Token(prefix, prevColIndex, prevLineIndex);
		tokens.splice(index, 0, prevToken);
		token.s = token.s.substring(prefix.length);
	}
}

const sanitizers = [
plusMinusSanitizer,
pseudoClassSanitizer
];

export function sanitizeTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		for (let s = 0; s < sanitizers.length; s++) {
			sanitizers[s](tokens, i);
		}
	}
};