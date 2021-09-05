import { isIdentifier } from '../isIdentifier.js';
import { isNumberLiteral } from '../isNumberLiteral.js';
import { Token } from
'../../../../Token.js';

const previousValuesIndicatingSplitMinus = new Set([
	')', ']', '-'
]);

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (i === 0 || token.s[0] !== '-' ||
	token.s === '-')
		return false;

	const prevS = scanTokens[i - 1].s;
	if (isIdentifier(prevS) ||
	isNumberLiteral(prevS) ||
	previousValuesIndicatingSplitMinus.has(prevS))
		return true;

	return false;
}

export function sanitizeMinusOperators(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const token = scanTokens[i];
			const s = token.s;
			const colIndex = Math.max(0, token.colIndex - token.s.length + 1);
			const newToken = new Token('-', colIndex, token.lineIndex);
			scanTokens.splice(i, 0, newToken);
			token.s = s.substring(1);
		}
	}
};