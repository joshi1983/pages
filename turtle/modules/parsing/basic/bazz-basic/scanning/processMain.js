import { Token } from
'../../../generic-parsing-utilities/Token.js';

function isOfInterest(tokens, i) {
	if (i > 0) {
		const prev = tokens[i - 1];
		if (prev.s.toLowerCase() === 'gosub')
			return false;
	}
	const token = tokens[i];
	if (token.s !== '[')
		return false;

	const next = tokens[i + 1];
	if (next === undefined || next.s.toLowerCase() !== 'main')
		return false;

	const closeBracket = tokens[i + 2];
	if (closeBracket.s !== ']')
		return false;
	return true;
}

export function processMain(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			tokens[i].s = 'SUB';
			const openBracket = tokens[i + 2];
			openBracket.s = '(';
			tokens.splice(i + 3, 0, new Token(')', openBracket.colIndex + 1, openBracket.lineIndex));
		}
	}
};