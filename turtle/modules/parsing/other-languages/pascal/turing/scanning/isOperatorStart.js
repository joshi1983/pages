import { Operators } from
'../Operators.js';

const operatorStarts = new Set();
for (const info of Operators.getAll()) {
	const s = info.symbol;
	for (let i = 1; i <= s.length; i++) {
		operatorStarts.add(s.substring(0, i));
	}
}

export function isOperatorStart(s) {
	return operatorStarts.has(s);
};