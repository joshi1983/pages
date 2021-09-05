import { getArgsEndIndexes } from
'../getArgsEndIndexes.js';
import { Token } from
'../../../../Token.js';

export function processDraw(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'draw') {
			const result = getArgsEndIndexes(scanTokens, i + 1, [2]);
			if (result !== undefined) {
				token.s = 'line';
				const [endIndex] = result;
				const tokens = scanTokens.slice(i + 1, endIndex + 1);
				const last = tokens[tokens.length - 1];
				const minus = new Token('-', token.colIndex + 1, token.lineIndex);
				const openBracket = new Token('(', token.colIndex + 2, token.lineIndex);
				const closeBracket = new Token(')', last.colIndex + 1, last.lineIndex);
				tokens.splice(0, 0, minus, openBracket);
				tokens.push(closeBracket);
				scanTokens.splice(i + 1, endIndex - i, ...tokens);
			}
		}
	}
};