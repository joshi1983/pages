import { indexOfRegExEnd } from './indexOfRegExEnd.js';
import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isValidIdentifier } from './isValidIdentifier.js';
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
	(isCompleteNumberLiteral(prevToken.s) || prevToken.s === ')' || isValidIdentifier(prevToken.s))) {
		const operatorToken = new Token(ch, prevToken.colIndex + 1, prevToken.lineIndex);
		tokens.splice(index, 0, operatorToken);
		token.s = token.s.substring(1);
	}
}

function spreadSanitizer(tokens, index) {
	const token = tokens[index];
	if (token.s === '..') {
		const newPreviousToken = new Token('.', token.colIndex - 1, token.lineIndex);
		token.s = '.';
		tokens.splice(index, 0, newPreviousToken); // insert.
	}
}

function regularExpressionSanitizer(tokens, index) {
	const regexEndIndex = indexOfRegExEnd(tokens, index);
	if (regexEndIndex > index) {
		const lastToken = tokens[regexEndIndex];
		let s = '';
		for (let i = index; i <= regexEndIndex; i++) {
			s += tokens[i].s;
		}
		const newRegexToken = new Token(s, lastToken.colIndex, lastToken.lineIndex);
		tokens.splice(index, regexEndIndex + 1 - index, newRegexToken);
	}
}

const sanitizers = [
plusMinusSanitizer,
regularExpressionSanitizer,
spreadSanitizer
];

export function sanitizeTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		for (let s = 0; s < sanitizers.length; s++) {
			sanitizers[s](tokens, i);
		}
	}
};