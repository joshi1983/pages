import { evaluateToken } from './evaluateToken.js';

function add(val1, val2) {
	return val1 + val2;
}

function bitShiftLeft(val1, val2) {
	return val1 << val2;
}

function bitShiftRight(val1, val2) {
	return val1 >> val2;
}

function divide(val1, val2) {
	return val1 / val2;
}

function equal(val1, val2) {
	return val1 === val2;
}

function greater(val1, val2) {
	return val1 > val2;
}

function greaterOrEqual(val1, val2) {
	return val1 >= val2;
}

function less(val1, val2) {
	return val1 < val2;
}

function lessOrEqual(val1, val2) {
	return val1 <= val2;
}

function multiply(val1, val2) {
	return val1 * val2;
}

function subtract(val1, val2) {
	return val1 - val2;
}

const operators = new Map([
	['+', add],
	['/', divide],
	['>>', bitShiftRight],
	['<<', bitShiftLeft],
	['==', equal],
	['>', greater],
	['>=', greaterOrEqual],
	['<', less],
	['<=', lessOrEqual],
	['*', multiply],
	['-', subtract]
]);

export function evaluateBinaryOperator(token) {
	if (token.children.length !== 2)
		return;

	const left = token.children[0];
	const right = token.children[1];
	const leftVal = evaluateToken(left);
	const rightVal = evaluateToken(right);
	const operator = operators.get(token.val);
	if (operator === undefined)
		return;

	if (leftVal !== undefined && rightVal !== undefined)
		return operator(leftVal, rightVal);
};