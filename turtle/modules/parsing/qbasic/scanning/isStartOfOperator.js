import { QBasicOperators } from '../QBasicOperators.js';

const firstChars = new Set();
let maxOperatorLength = 0;
const symbols = [];
QBasicOperators.getAllOperatorsInfo().forEach(function(info) {
	firstChars.add(info.symbol[0]);
	maxOperatorLength = Math.max(maxOperatorLength, info.symbol.length);
	symbols.push(info.symbol);
});

export function isStartOfOperator(s) {
	// a couple quick checks for better average performance.
	if (!firstChars.has(s[0]) || s.length > maxOperatorLength)
		return false;
	for (const op of symbols) {
		if (op.startsWith(s))
			return true;
	}
	return false;
};