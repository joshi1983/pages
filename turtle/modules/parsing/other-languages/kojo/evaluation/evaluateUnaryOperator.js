import { evaluateToken } from './evaluateToken.js';

function negative(val1) {
	return -val1;
}

function not(val1) {
	return !val1;
}

const operatorsMap = new Map([
	['-', negative],
	['!', not],
]);

export function evaluateUnaryOperator(token) {
	if (token.children.length === 1) {
		const val1 = evaluateToken(token.children[0]);
		if (val1 !== undefined) {
			const evalFunc = operatorsMap.get(token.val);
			if (evalFunc !== undefined)
				return evalFunc(val1);
		}
	}
};