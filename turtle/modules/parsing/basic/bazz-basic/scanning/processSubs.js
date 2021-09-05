import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

function isOfInterest(tokens, index) {
	if (index > 0) {
		const prev = tokens[index - 1];
		if (prev.s.toLowerCase() === 'gosub')
			return false;
	}
	const token = tokens[index];
	if (token.s !== '[')
		return false;
	const next = tokens[index + 1];
	if (next === undefined || next.s.toLowerCase() !== 'sub')
		return false;
	const colonToken = tokens[index + 2];
	if (colonToken === undefined || colonToken.s !== ':')
		return false;
	const subNameToken = tokens[index + 3];
	if (!isIdentifier(subNameToken.s))
		return false;
	return true;
}

export function processSubs(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			tokens[i].s = 'SUB';
			const nameToken = tokens[i + 3];
			const openBracket = new Token('(', nameToken.colIndex + 1, nameToken.lineIndex);
			const closeBracket = new Token(')', nameToken.colIndex + 2, nameToken.lineIndex);
			const closeSquareBracket = tokens[i + 4];
			let numToRemove = 3;
			if (closeSquareBracket !== undefined && closeSquareBracket.s === ']') {
				numToRemove++;
			}
			tokens.splice(i + 1, numToRemove, nameToken, openBracket, closeBracket);
		}
	}
};