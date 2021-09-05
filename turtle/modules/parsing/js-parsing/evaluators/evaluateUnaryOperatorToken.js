import { evaluateLiteralToken } from './evaluateLiteralToken.js';

function negate(val) {
	return -val;
}

function not(val) {
	return !val;
}

const operatorToFuncMap = new Map([
['!', not],
['-', negate]
]);

export function evaluateUnaryOperatorToken(token) {
	if (token.children.length === 1) {
		const childVal = evaluateLiteralToken(token.children[0]);
		if (childVal !== undefined) {
			const func = operatorToFuncMap.get(token.val);
			if (func !== undefined)
				return func(childVal);
		}
	}
};