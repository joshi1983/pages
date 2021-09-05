import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { isPossibleData } from './isPossibleData.js';
import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CHARACTER_LITERAL,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
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

function shouldMakeDataTypeExpression(prev, next) {
	if (next.val === '*') {
		if (getClosestOfType(prev, ParseTreeTokenType.DATA_TYPE_EXPRESSION) !== null)
			return false;
		if (next.type === ParseTreeTokenType.UNARY_OPERATOR)
			return true;
		const children = prev.children;
		const last = children[children.length - 1];
		if (prev.type === ParseTreeTokenType.FUNC && last !== undefined &&
		last.type === ParseTreeTokenType.ARG_LIST) {
			return true;
		}
	}
	return false;
}

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null || shouldMakeDataTypeExpression(prev, next))
		return true;
	if (isComplete(prev) === MaybeDecided.No)
		return true;
	if (next.val === '*') {
		if (prev.type === ParseTreeTokenType.ARRAY_SUBSCRIPT &&
		parent.type === ParseTreeTokenType.ARRAY_LITERAL)
			return false;
		if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return true;
	}
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

function shouldBecomeUnaryOperator(prev, next) {
	if (next.val !== '*')
		return false;

	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL)
		return true;

	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return true;

	const struct = getClosestOfType(prev, ParseTreeTokenType.STRUCT);
	if (struct !== null)
		return true;
	return false;
}

export function processBinaryOperator(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (shouldBecomeUnaryOperator(prev, next)) {
		next.type = ParseTreeTokenType.UNARY_OPERATOR;
	}
	else if (goodPreviousTypes.has(prev.type)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		prev.remove();
		next.appendChild(prev);
		return next;
	}

	if (shouldMakeDataTypeExpression(prev, next)) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		next.type = ParseTreeTokenType.UNARY_OPERATOR;
		dte.appendChild(next);
		prev.appendChild(dte);
		return dte;
	}
	else {
		prev.appendChild(next);
	}
	return next;
};