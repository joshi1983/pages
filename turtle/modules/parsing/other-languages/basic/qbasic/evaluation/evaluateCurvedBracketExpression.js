import { evaluateToken } from './evaluateToken.js';

export function evaluateCurvedBracketExpression(token) {
	const children = token.children;
	if (children.length < 2)
		return;
	return evaluateToken(children[1]);
};