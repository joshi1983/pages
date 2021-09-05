import { isNumberLiteralStart } from
'../../../qbasic/scanning/isNumberLiteralStart.js';
import { Token } from
'../../../../Token.js';

function mightBeBeforeLabel(s) {
	return s.toLowerCase() === 'then';
}

function mightBeLabel(s) {
	return isNumberLiteralStart(s);
}

export function processGoto(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (mightBeBeforeLabel(scanTokens[i - 1].s) &&
		mightBeLabel(token.s)) {
			const gotoToken = new Token('goto', token.colIndex - 1, token.lineIndex);
			scanTokens.splice(i, 0, gotoToken);
			i++;
		}
	}
};