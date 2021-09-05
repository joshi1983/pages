import { evaluateLiteralToken } from './evaluateLiteralToken.js';

export function evaluateCurvedBracketExpressionToken(token) {
	if (token.children.length === 3) {
		const childVal = evaluateLiteralToken(token.children[1]);
		if (childVal !== undefined)
			return childVal;
	}
};