import { isValidInputToken } from './isValidInputToken.js';
import { isValidVariableName } from './isValidVariableName.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

function shouldBeSplit(tokens, index) {
	const token = tokens[index];
	const s = token.s;
	if (s.length < 2 || index < 1)
		return false;
	const ch = s[0];
	if (ch === '+' || ch === '-') {
		const prevToken = tokens[index - 1];
		if (prevToken.lineIndex !== token.lineIndex)
			return false;
		if (prevToken.colIndex < token.colIndex - token.s.length)
			return false;
		if (!isNaN(prevToken.s) || isValidVariableName(prevToken.s) ||
		isValidInputToken(prevToken.s))
			return true;
	}
	return false;
}

function getSplitIndex(s) {
	return 1;
}

export function splitTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (shouldBeSplit(tokens, i)) {
			const token = tokens[i];
			const index = getSplitIndex(token.s);
			const colIndexOffset = token.s.length - index;
			const newToken = new Token(token.s.substring(0, index), 
				token.colIndex - colIndexOffset,
				token.lineIndex);
			token.s = token.s.substring(index);
			tokens.splice(i, 0, newToken);
		}
	}
};