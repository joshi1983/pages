import { processIndexExpression } from './processIndexExpression.js';

export function processExpressionIndexExpressionAssignmentPrefix(token, result, settings) {
	const children = token.children;
	if (children.length < 2)
		return; // weird case but don't throw a JavaScript error.
	const indexToken = children[1];
	result.append('setItem ');
	processIndexExpression(indexToken, result, settings);
	result.trimRight();
	result.append(' "' + children[0].val + ' ');
};