import { getArgsEndIndexes } from
'../getArgsEndIndexes.js';
import { Token } from
'../../../../Token.js';

export function processLine(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'line') {
			const pair = getArgsEndIndexes(scanTokens, i + 1, [2, 4]);
			if (pair !== undefined) {
				const [middleIndex, endIndex] = pair;
				const tokens = scanTokens.slice(i + 1, endIndex + 1);
				tokens.splice(0,0, new Token('(', token.colIndex + 1, token.lineIndex));
				const middle = scanTokens[middleIndex + 1];
				middle.s = '-';
				tokens.splice(middleIndex + 1, 0, new Token(')', middle.colIndex - 1, middle.lineIndex));
				tokens.splice(middleIndex + 3, 0, new Token('(', middle.colIndex + 1, middle.lineIndex));
				const last = tokens[tokens.length - 1];
				const vals = [')'];
				for (let j = 0; j < vals.length; j++) {
					tokens.push(new Token(vals[j], last.colIndex + 1 + j, last.lineIndex));
				}
				scanTokens.splice(i + 1, endIndex - i + 1, ...tokens);
			}
		}
	}
};