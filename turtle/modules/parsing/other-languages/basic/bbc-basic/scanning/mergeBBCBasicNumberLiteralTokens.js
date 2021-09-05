import { isNumberLiteral } from './isNumberLiteral.js';

export function mergeBBCBasicNumberLiteralTokens(tokens) {
	for (let i = 1 ; i < tokens.length; i++) {
		const prev = tokens[i - 1];
		if (prev.s !== '&')
			continue;
		const next = tokens[i];
		if (next.lineIndex !== prev.lineIndex ||
		next.colIndex !== prev.colIndex + prev.s.length + next.s.length - 1)
			continue;
		if (isNumberLiteral(prev.s + next.s)) {
			prev.s += next.s;
			prev.colIndex = next.colIndex;
			tokens.splice(i, 1); // remove next.
			i--; // can
		}
	}
};