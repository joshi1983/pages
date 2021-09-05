import { canBeIntegerLabel } from
'../qbasic/scanning/canBeIntegerLabel.js';
import { Token } from
'../../Token.js';

function mightBeBeforeLabel(s) {
	return s.toLowerCase() === 'then';
}

export function processThenGoto(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (mightBeBeforeLabel(scanTokens[i - 1].s) &&
		canBeIntegerLabel(token.s)) {
			const gotoToken = new Token('goto', token.colIndex - 1, token.lineIndex);
			scanTokens.splice(i, 0, gotoToken);
			i++;
		}
	}
};