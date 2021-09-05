import { evaluateToken } from './evaluateToken.js';

function greater(val1, val2) {
	return val1 > val2;
}

function less(val1, val2) {
	return val1 < val2;
}

function equal(val1, val2) {
	return val1 === val2;
}

function greaterEqual(val1, val2) {
	return val1 >= val2;
}

function lessEqual(val1, val2) {
	return val1 <= val2;
}

function divide(val1, val2) {
	return val1 / val2;
}

function minus(val1, val2) {
	return val1 - val2;
}

function multiply(val1, val2) {
	return val1 * val2;
}

function plus(val1, val2) {
	return val1 + val2;
}

const operatorsMap = new Map([
	['>', greater],
	['<', less],
	['==', equal],
	['>=', greaterEqual],
	['<=', lessEqual],
	['+', plus],
	['-', minus],
	['*', multiply],
	['/', divide]
]);

export function evaluateBinaryOperator(token) {
	if (token.children.length === 2) {
		const val1 = evaluateToken(token.children[0]);
		const val2 = evaluateToken(token.children[1]);
		if (val1 !== undefined && val2 !== undefined) {
			const evalFunc = operatorsMap.get(token.val);
			if (evalFunc !== undefined)
				return evalFunc(val1, val2);
		}
	}
};