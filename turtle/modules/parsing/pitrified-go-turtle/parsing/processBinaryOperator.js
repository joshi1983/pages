import { isPossibleData } from './isPossibleData.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER
]);

function isGoodPrevious(prev, next) {
	if (prev.parentNode === null)
		return true;
	if (next.val === '*') {
		if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return true;
	}
	return isPossibleData(prev);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;

	return prev;
}

export function processBinaryOperator(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (goodPreviousTypes.has(prev.type)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		prev.remove();
		next.appendChild(prev);
	}
	else { 
		if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			next.type = ParseTreeTokenType.UNARY_OPERATOR;
		prev.appendChild(next);
	}
	return next;
};