import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { getStartingLineIndex } from './getStartingLineIndex.js';
import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { subscriptExpressionFirstChildTypes } from './processSquareLeftBracket.js';

const joiningTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.IN
]);
const goodIfChildTypes = new Set([
	ParseTreeTokenType.ELIF,
	ParseTreeTokenType.ELSE,
]);
const elseParentTypes = new Set([
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.WHILE_LOOP
]);

function isArgumentListComplete(prev, next) {
	const prevChildren = prev.children;
	if (prevChildren.length === 0)
		return false;
	const first = prevChildren[0];
	if (first.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return prevChildren[prevChildren.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;

	return !joiningTypes.has(next.type);
}

function isClassComplete(prev, next) {
	const children = prev.children;
	if (children.length < 3)
		return false;

	if (next.indentLevel <= prev.indentLevel)
		return true;
	return true;
}

function isCompleteCommaExpression(prev, next) {
	if (next.type === ParseTreeTokenType.COMMA) {
		return false;
	}
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.COMMA)
		return false;

	return true;
}

function isCompleteDecorator(prev, next) {
	if (prev.children.length >= 1)
		return true;
	if (next.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false;
	return true;
}

function isGlobalComplete(prev, next) {
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;
	if (lastChild.type !== ParseTreeTokenType.COMMA &&
	next.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	return next.lineIndex !== prev.lineIndex;
}

function isIdentifierComplete(prev, next) {
	if (prev.parentNode.type === ParseTreeTokenType.CLASS)
		return true;
	if (prev.children.length === 0) {
		if (next.type === ParseTreeTokenType.DOT ||
		next.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return false;
		if (prev.val === 'print' && prev.parentNode.val !== '.')
			return false;
	}
	return true;
}

function isIfStatementComplete(prev, next) {
	if (prev.children.length < 3)
		return false;

	return !goodIfChildTypes.has(next.type);
}

function isImportComplete(prev, next) {
	if (prev.lineIndex !== getStartingLineIndex(next))
		return true;
	return false;
}

function isReturnComplete(prev, next) {
	if (prev.lineIndex !== getStartingLineIndex(next))
		return true;
	return false;
}

const checkers = new Map([
	[ParseTreeTokenType.ARGUMENT_LIST, isArgumentListComplete],
	[ParseTreeTokenType.CLASS, isClassComplete],
	[ParseTreeTokenType.COMMA_EXPRESSION, isCompleteCommaExpression],
	[ParseTreeTokenType.DECORATOR, isCompleteDecorator],
	[ParseTreeTokenType.GLOBAL, isGlobalComplete],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete],
	[ParseTreeTokenType.IF_STATEMENT, isIfStatementComplete],
	[ParseTreeTokenType.IMPORT, isImportComplete],
	[ParseTreeTokenType.RETURN, isReturnComplete]
]);

const dedentBlockEndingTypes = new Set([
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.PASS,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.WHILE_LOOP,
]);

export function isCompleteTokenWithNext(prev, next) {
	if (dedentBlockEndingTypes.has(next.type) &&
	!subscriptExpressionFirstChildTypes.has(prev.type)) {
		const lastDescendent = getSortedLastDescendentTokenOf(prev);
		if (lastDescendent.lineIndex === getStartingLineIndex(next))
			return false;
	}
	const checker = checkers.get(prev.type);
	if (checker !== undefined)
		return checker(prev, next);

	if (next.type === ParseTreeTokenType.ELSE)
		return !elseParentTypes.has(prev.type);

	if (next.type === ParseTreeTokenType.ELIF) {
		return prev.type !== ParseTreeTokenType.IF_STATEMENT;
	}

	if ((prev.type === ParseTreeTokenType.CODE_BLOCK ||
	prev.type === ParseTreeTokenType.CLASS_BODY) &&
	next.type !== ParseTreeTokenType.INDENT) {
		if (next.indentLevel < prev.indentLevel &&
		next.lineIndex !== prev.lineIndex)
			return true;
	}

	return isCompleteToken(prev);
};