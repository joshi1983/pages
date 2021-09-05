import { evaluateToken } from
'./evaluateToken.js';

function add(a, b) {
	return a + b;
}

function and(a, b) {
	return a && b;
}

function divide(a, b) {
	return a / b;
}

function equal(a, b) {
	return a === b;
}

function greater(a, b) {
	return a > b;
}

function greaterEqual(a, b) {
	return a >= b;
}

function implies(a, b) {
	return (!a) || b;
}

function integerDivide(a, b) {
	return Math.floor(a / b);
}

function less(a, b) {
	return a < b;
}

function lessEqual(a, b) {
	return a <= b;
}

function minus(a, b) {
	return a - b;
}

function mod(a, b) {
	return a % b; // FIXME: test cases where remainder and modulo are different.
}

function multiply(a, b) {
	return a * b;
}

function notEqual(a, b) {
	return a !== b;
}

function or(a, b) {
	return a || b;
}

function power(a, b) {
	return Math.pow(a, b);
}

function xor(a, b) {
	return a ^ b;
}

const operatorFuncs = new Map([
	['+', add],
	['-', minus],
	['*', multiply],
	['/', divide],
	['\\', integerDivide],
	['>', greater],
	['>=', greaterEqual],
	['<', less],
	['<=', lessEqual],
	['=', equal],
	['<>', notEqual],
	['^', power],
	['and', and],
	['imp', implies],
	['mod', mod],
	['or', or],
	['xor', xor]
]);

export function evaluateBinaryOperator(token) {
	const children = token.children;
	if (children.length !== 2)
		return;
	const leftVal = evaluateToken(children[0]);
	if (leftVal === undefined)
		return;
	const rightVal = evaluateToken(children[1]);
	if (rightVal === undefined)
		return;

	const f = operatorFuncs.get(token.val.toLowerCase());
	if (f === undefined)
		return;
	return f(leftVal, rightVal);
};