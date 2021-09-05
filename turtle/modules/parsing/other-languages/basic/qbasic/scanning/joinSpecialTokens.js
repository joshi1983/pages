import { isBase10NumberLiteralStart } from
'./isBase10NumberLiteralStart.js';
import { isCompleteNumberLiteral } from
'./isCompleteNumberLiteral.js';

function getNumberLiteralLength(tokens, i) {
	const token = tokens[i];
	if (!isBase10NumberLiteralStart(token.s))
		return 0;
	let prev = token;
	let s = token.s;
	for (let offset = 1; offset < 4; offset++) {
		const tok = tokens[i + offset];
		if (tok === undefined ||
		tok.lineIndex !== token.lineIndex ||
		tok.colIndex !== prev.colIndex + tok.s.length)
			break; // whitespace between the tokens means we stop looking for a complete number literal.

		s += tok.s;
		if (isCompleteNumberLiteral(s))
			return offset + 1;
		prev = tok;
	}
	return 1;
}

function processToken(tokens, i) {
	const len = getNumberLiteralLength(tokens, i);
	if (len > 1) {
		const token = tokens[i];
		const lastToken = tokens[i + len - 1];
		for (let j = i + 1; j < i + len; j++) {
			token.s += tokens[j].s;
		}
		token.colIndex += lastToken.colIndex;
		tokens.splice(i + 1, len - 1);
	}
}

export function joinSpecialTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		processToken(tokens, i);
	}
};