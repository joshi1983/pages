import { Token } from '../../../Token.js';

export function splitNumberFormatAssignments(tokens) {
	let lastPrintIndex = -1;
	for (let i = 0; i < tokens.length; i++ ) {
		const token = tokens[i];
		const s = token.s.toLowerCase();
		if (s.startsWith('@%=') && s.indexOf('\n') === -1) {
			const newToken = new Token('@%', token.colIndex + 2 - s.length, token.lineIndex);
			token.s = token.s.substring(2);
			tokens.splice(i, 0, newToken);
		}
		else if (token.s[0] === '=' && token.s.length !== 1 && token.s.indexOf('\n') === -1) {
			const newToken = new Token('=', token.colIndex + 1 - token.s.length, token.lineIndex);
			token.s = token.s.substring(1);
			tokens.splice(i, 0, newToken);
		}
	}
};