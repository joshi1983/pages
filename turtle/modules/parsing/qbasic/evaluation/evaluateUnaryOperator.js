import { evaluateToken } from
'./evaluateToken.js';

function neg(val) {
	return -val;
}

function not(val) {
	return !val;
}

const funcs = new Map([
	['-', neg],
	['not', not],
]);

export function evaluateUnaryOperator(token) {
	const children = token.children;
	if (children.length !== 1)
		return;
	const val = evaluateToken(children[0]);
	if (val === undefined)
		return;
	const f = funcs.get(token.val.toLowerCase());
	if (f === undefined)
		return;
	return f(val);
};