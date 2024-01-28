import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isValidIdentifier } from './isValidIdentifier.js';
import { Token } from './Token.js';

function mayBeAdjacent(prevToken, nextToken) {
	if (prevToken === undefined)
		return false;
	const s = nextToken.s;
	let lineIndex = nextToken.lineIndex;
	let colIndex = nextToken.colIndex;
	let lineIndexChanged = false;
	for (let i = s.length - 1; i >= 0; i--) {
		const ch = s[i];
		if (ch === '\n') {
			lineIndex--;
			lineIndexChanged = true;
		}
		else {
			colIndex--;
		}
	}
	if (prevToken.lineIndex !== lineIndex)
		return false;
	if (lineIndexChanged === false && prevToken.colIndex !== colIndex)
		return false;
	return true;
}

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

const sanitizers = [plusMinusSanitizer, spreadSanitizer];

export function sanitizeTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		for (let s = 0; s < sanitizers.length; s++) {
			sanitizers[s](tokens, i);
		}
	}
};