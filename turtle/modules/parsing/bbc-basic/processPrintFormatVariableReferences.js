import { isIdentifier } from '../qbasic/scanning/isIdentifier.js';
import { Token } from '../Token.js';

function getGoodVariableName(scanTokens) {
	const identifiersUsed = new Set();
	for (const token of scanTokens) {
		if (isIdentifier(token.s))
			identifiersUsed.add(token.s.toLowerCase());
	}
	const names = ['numberFormat', 'numberFormat_', '_numberFormat_'];
	for (const name of names) {
		if (!identifiersUsed.has(name.toLowerCase()))
			return name;
	}
	for (let i = 2; true; i++) {
		for (const name of names) {
			const name2 = name + i;
			if (!identifiersUsed.has(name2.toLowerCase()))
				return name;
		}
	}
}

export function processPrintFormatVariableReferences(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.startsWith('@%')) {
			if (token.s.length > 2 && token.s.indexOf('\n') === -1) {
				const newToken = new Token(token.s.substring(2), token.lineIndex, token.colIndex);
				scanTokens.splice(i + 1, 0, newToken); // insert the new token.
				token.s = '@%';
				token.colIndex -= newToken.s.length;
			}
		}
	}
	const newName = getGoodVariableName(scanTokens);
	for (let token of scanTokens) {
		if (token.s === '@%')
			token.s = newName;
	}
};