import { isPossibleData } from './isPossibleData.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);

function isGoodPreviousDown(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return true;

	if (!isPossibleData(prev.type))
		return false;

	return true;
}

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
	while (!isGoodPreviousDown(prev, next))
		prev = prev.children[prev.children.length - 1];
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