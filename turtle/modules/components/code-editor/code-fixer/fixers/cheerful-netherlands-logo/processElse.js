import { Token } from
'../../../../../parsing/Token.js';

function getAssociatedIf(scanTokens, elseIndex) {
	let bracketBalance = -1;
	for (let j = elseIndex - 1; j >= 0; j-- ) {
		const token = scanTokens[j];
		if (token.s === ']')
			bracketBalance--;
		else if (token.s === '[')
			bracketBalance++;
		else if (bracketBalance === 0 && token.s === 'if')
			return scanTokens[j];
	}
}

export function processElse(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'anders') {
			const associatedIf = getAssociatedIf(scanTokens, i);
			if (associatedIf !== undefined) {
				associatedIf.s = 'ifelse';
				token.s = '[';
				const endBracket = new Token(']', token.lineIndex, token.colIndex - 2);
				scanTokens.splice(i, 0, endBracket);
			}
		}
	}
};