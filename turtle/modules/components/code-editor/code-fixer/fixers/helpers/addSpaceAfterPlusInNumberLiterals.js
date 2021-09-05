import { Token } from
'../../../../../parsing/Token.js';

function needsSplit(s) {
	if (s[0] !== '+' || isNaN(s.substring(1)))
		return false;
	return true;
}

export function addSpaceAfterPlusInNumberLiterals(scanTokens) {
	let offset = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (i !== 0 && token.lineIndex !== scanTokens[i - 1].lineIndex)
			offset = 0;
		if (needsSplit(token.s)) {
			scanTokens.splice(i, 0, new Token('+', offset + token.colIndex - token.s.length + 1, token.lineIndex));
			token.s = token.s.substring(1);
			offset++;
		}
		token.colIndex += offset;
	}
};