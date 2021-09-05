import { evaluateLiteralToken } from './evaluateLiteralToken.js';

function add(v1, v2) {
	return v1 + v2;
}

function subtract(v1, v2) {
	return v1 - v2;
}

function multiply(v1, v2) {
	return v1 * v2;
}

function divide(v1, v2) {
	return v1 / v2;
}

function power(v1, v2) {
	return v1 ** v2;
}

function equal1(v1, v2) {
	return v1 == v2;
}

function equal2(v1, v2) {
	return v1 === v2;
}

function greater(v1, v2) {
	return v1 > v2;
}

function less(v1, v2) {
	return v1 < v2;
}

function greaterOrEqual(v1, v2) {
	return v1 >= v2;
}

function lessOrEqual(v1, v2) {
	return v1 <= v2;
}

function notEqual1(v1, v2) {
	return v1 != v2;
}

function notEqual2(v1, v2) {
	return v1 !== v2;
}

function bitwiseAnd(val1, val2) {
	return val1 & val2;
}

function logicalAnd(val1, val2) {
	return val1 && val2;
}

function bitwiseOr(val1, val2) {
	return val1 | val2;
}

function logicalOr(val1, val2) {
	return val1 || val2;
}

const opFuncMap = new Map([
	['+', add],
	['-', subtract],
	['*', multiply],
	['/', divide],
	['**', power],
	['==', equal1],
	['===', equal2],
	['<', less],
	['>', greater],
	['>=', greaterOrEqual],
	['<=', lessOrEqual],
	['!=', notEqual1],
	['!==', notEqual2],
	['&', bitwiseAnd],
	['&&', logicalAnd],
	['|', bitwiseOr],
	['||', logicalOr],
]);

export function evaluateBinaryOperatorToken(token) {
	if (token.children.length === 2) {
		const children = token.children;
		const val1 = evaluateLiteralToken(children[0]);
		const val2 = evaluateLiteralToken(children[1]);
		if (val1 !== undefined && val2 !== undefined) {
			const func = opFuncMap.get(token.val);
			if (func !== undefined)
				return func(val1, val2);
		}
	}
};