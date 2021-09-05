import { isPossibleData } from './isPossibleData.js';
import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CHARACTER_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function isGoodPreviousDown(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return true;

	if (isComplete(prev) === MaybeDecided.No)
		return false;
	if (!isPossibleData(prev)) {
		return false;
	}
	if (prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	prev.children.length === 2)
		return false;
	return true;
}

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null)
		return true;
	if (isComplete(prev) === MaybeDecided.No)
		return true;
	return isPossibleData(prev);
}

function getGoodPrevious(prev, next) {
	let tok = prev;
	while (!isGoodPreviousDown(tok, next)) {
		tok = tok.children[tok.children.length - 1];
	}
	if (isPossibleData(tok) && isComplete(tok) === MaybeDecided.Yes)
		prev = tok;
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
		return next;
	}

	prev.appendChild(next);
	return next;
};