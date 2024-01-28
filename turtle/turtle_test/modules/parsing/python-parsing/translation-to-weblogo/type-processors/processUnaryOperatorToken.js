import { printChildren } from './helpers/printChildren.js';

export function processUnaryOperatorToken(token, result, cachedParseTree) {
	const val = token.val;
	result.append(val);
	printChildren(token, result, cachedParseTree);
};