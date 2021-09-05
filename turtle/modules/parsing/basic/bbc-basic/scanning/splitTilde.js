import { isBase10IntegerLiteral } from './isBase10IntegerLiteral.js';
import { Token } from '../../../Token.js';

const printIndexResetValues = new Set([
	'def', 'dim', 'endproc', 'let', 'mode', 'vdu'
]);

export function splitTilde(tokens) {
	let lastPrintIndex = -1;
	for (let i = 0; i < tokens.length; i++ ) {
		const token = tokens[i];
		const s = token.s.toLowerCase();
		if (s === 'print')
			lastPrintIndex = i;
		else if (printIndexResetValues.has(s))
			lastPrintIndex = -1;
		else if (token.s[0] === '~' &&
		token.s.length > 1 &&
		lastPrintIndex >= 0 &&
		isBase10IntegerLiteral(token.s.substring(1))) {
			token.colIndex = token.colIndex - (token.s.length - 1);
			const newToken = new Token(token.s.substring(1), token.colIndex, token.lineIndex);
			token.s = '~';
			tokens.splice(i + 1, 0, newToken); // insert new token.
		}
	}
};