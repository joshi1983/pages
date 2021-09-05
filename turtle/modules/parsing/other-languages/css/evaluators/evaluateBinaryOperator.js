import { evaluateToken } from './evaluateToken.js';

const ops = new Map([
	['-', (a, b) => a - b],
	['+', (a, b) => a + b],
	['*', (a, b) => a * b],
	['/', (a, b) => a / b]
]);

export function evaluateBinaryOperator(token) {
	if (!ops.has(token.val))
		return;
	const children = token.children;
	if (children.length !== 2)
		return;
	const val1 = evaluateToken(children[0]);
	const val2 = evaluateToken(children[1]);
	if (val1 !== undefined && val2 !== undefined) {
		return ops.get(token.val)(val1, val2);
	}
};