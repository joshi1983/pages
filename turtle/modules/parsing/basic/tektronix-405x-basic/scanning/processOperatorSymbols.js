import { TektronixOperators } from '../TektronixOperators.js';
const operators = new Set();
TektronixOperators.getAllData().operators.forEach(function(operatorInfo) {
	operators.add(operatorInfo.symbol);
});

function isOperator(s) {
	return operators.has(s);
}

export function processOperatorSymbols(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		const prev = tokens[i - 1];
		const token = tokens[i];
		if (prev.s === '=' && prev.lineIndex === token.lineIndex &&
		prev.colIndex === token.colIndex - 1 &&
		isOperator(prev.s + token.s)) {
			prev.s += token.s;
			prev.colIndex = token.colIndex;
			tokens.splice(i, 1); // remove the extra token.
		}
	}
};