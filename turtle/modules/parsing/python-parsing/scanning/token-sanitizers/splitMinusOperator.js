import { isNumberLiteral } from '../isNumberLiteral.js';
import { PythonOperators } from '../../PythonOperators.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

const noSplitPreviousVals = new Set([
	':', ',', '[', '(', '*'
]);

for (const info of PythonOperators.getAll()) {
	if (info.unary === undefined)
		noSplitPreviousVals.add(info.symbol);
}

function shouldGetSplit(scanTokens, i) {
	const tok = scanTokens[i];
	if (tok.s[0] !== '-' || tok.s === '-')
		return false;
	const info = PythonOperators.getOperatorInfo(tok.s);
	if (info !== undefined)
		return false;

	if (i === 0)
		return !isNumberLiteral(tok.s);
	const prev = scanTokens[i - 1];
	if (noSplitPreviousVals.has(prev.s))
		return false;
	return true;
}

export function splitMinusOperator(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (shouldGetSplit(scanTokens, i)) {
			let colIndex = Math.max(0, tok.colIndex - tok.s.length + 1);
			const minus = new Token('-', colIndex, tok.lineIndex);
			tok.s = tok.s.substring(1); // remove first character, the - sign.
			scanTokens.splice(i, 0, minus);
		}
	}
};