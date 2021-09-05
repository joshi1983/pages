import { mightBeNumericValue } from './mightBeNumericValue.js';
import { Token } from '../../../../generic-parsing-utilities/Token.js';

export function processHPlotToLine(scanTokens) {
	for (let i = 0; i < scanTokens.length - 7; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'hplot') {
			token.s = 'line';
			const num1 = scanTokens[i + 1];
			if (!mightBeNumericValue(num1.s))
				continue;
			const comma1 = scanTokens[i + 2];
			if (comma1.s !== ',')
				continue;
			const num2 = scanTokens[i + 3];
			if (!mightBeNumericValue(num2.s))
				continue;
			const toToken = scanTokens[i + 4];
			if (toToken.s.toLowerCase() !== 'to')
				continue;
			const num3 = scanTokens[i + 5];
			if (!mightBeNumericValue(num3.s))
				continue;
			const comma2 = scanTokens[i + 6];
			if (comma2.s !== ',')
				continue;
			const num4 = scanTokens[i + 7];
			if (!mightBeNumericValue(num4.s) ||
			num4.lineIndex !== token.lineIndex)
				continue;
			const after = scanTokens[i + 8];
			if (after !== undefined && after.s.toLowerCase() === 'to')
				continue; // this code can't translate to a path with more than 1 line segment yet.

			toToken.s = '-';
			const openBracket1 = new Token('(', token.colIndex + 1, token.lineIndex);
			const closeBracket1 = new Token(')', num2.colIndex + 1, num2.lineIndex);
			const openBracket2 = new Token('(', num3.colIndex - 1, num3.lineIndex);
			const closeBracket2 = new Token(')', num4.colIndex + 1, num4.lineIndex);
			scanTokens.splice(i + 1, 7,
				openBracket1, num1, comma1, num2, closeBracket1,
				toToken, openBracket2, num3, comma2, num4, closeBracket2);
		}
	}
};