import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const validParentTypes = new Map([
	[ParseTreeTokenType.COLON, [
		ParseTreeTokenType.SQUARE_CASE,
		ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	]],
	[ParseTreeTokenType.COMMA, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
		ParseTreeTokenType.LET,
		ParseTreeTokenType.SET,
		ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION
	]],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION
	]],
	[ParseTreeTokenType.FOR, [
		ParseTreeTokenType.LINE_OF_CODE
	]],
	[ParseTreeTokenType.IF, [
		ParseTreeTokenType.LINE_OF_CODE
	]],
	[ParseTreeTokenType.SEMICOLON, [
		ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION
	]],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, [
		ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION
	]],
	[ParseTreeTokenType.WHILE, [
		ParseTreeTokenType.LINE_OF_CODE
	]],
]);
for (const [key, value] of Array.from(validParentTypes)) {
	if (value instanceof Array)
		validParentTypes.set(key, new Set(value));
}

const noChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.PERIOD,
	ParseTreeTokenType.PIPE,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
]);

const oneChildTypes = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.PAGE,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHILE
]);

const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR
]);

const threeChildTypes = new Set([
	ParseTreeTokenType.ABSOLUTE_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.SQUARE_CASE
]);

function isArgListComplete(token, next) {
	if (next.type === ParseTreeTokenType.IF ||
	next.type === ParseTreeTokenType.FOR ||
	next.type === ParseTreeTokenType.WHILE)
		return true;

	const children = token.children;
	if (children.length !== 0) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return hasLastChildType(token, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
	}
	return false;
}

function hasLastChildType(parent, lastType) {
	const children = parent.children;
	const lastChild = children[children.length - 1];
	return lastChild !== undefined &&
		lastChild.type === lastType;
}

const completeCheckers = new Map([
	[ParseTreeTokenType.ARG_LIST, isArgListComplete]
]);

export function isCompleteWithNext(prev, next) {
	if (prev.parentNode === null)
		return false;
	if (next.type === ParseTreeTokenType.PERIOD)
		return true;
	
	const completeChecker = completeCheckers.get(prev.type);
	if (completeChecker !== undefined)
		return completeChecker(prev, next);

	const validParentTypes_ = validParentTypes.get(next.type);
	if (validParentTypes_ !== undefined &&
	!validParentTypes_.has(prev.type)) {
		return true;
	}

	if (noChildTypes.has(prev.type))
		return true;
	if (oneChildTypes.has(prev.type))
		return prev.children.length >= 1;
	if (twoChildTypes.has(prev.type))
		return prev.children.length >= 2;
	if (threeChildTypes.has(prev.type))
		return prev.children.length >= 3;

	return false;
};