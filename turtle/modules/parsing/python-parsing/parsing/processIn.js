import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';

function shouldBecomeBinaryOperator(prev) {
	const parent = prev;
	return parent.type !== ParseTreeTokenType.FOR_LOOP;
}

export function processIn(prev, next) {
	if (shouldBecomeBinaryOperator(prev)) {
		next.type = ParseTreeTokenType.BINARY_OPERATOR;
		return processBinaryOperator(prev, next);
	}
	prev.appendChild(next);
	return next;
};