import { isPossibleData } from
'./isPossibleData.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CHARACTER_LITERAL,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.NIL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL
]);
const oneChildTypes = new Set([
	ParseTreeTokenType.GO,
	ParseTreeTokenType.RANGE,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.UNARY_OPERATOR,
]);
const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.STRUCT_INITIALIZATION
]);
const threeChildTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY
]);

function isCompleteCodeBlock(token) {
	const children = token.children;
	const first = children[0];
	const last = children[children.length - 1];
	if (first !== undefined) {
		if (first.type === ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return last.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
	}
	return false;
}

function isImportComplete(token) {
	const children = token.children;
	if (children.length === 0)
		return false;
	
	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.STRING_LITERAL ||
	lastChild.type === ParseTreeTokenType.IMPORT_PACKAGE_LIST)
		return true;
	return false;
}

function isLastChildType(type) {
	return function(token) {
		const children = token.children;
		if (children.length === 0)
			return false;

		const lastChild = children[children.length - 1];
		return lastChild.type === type;
	};
}

const completeCheckers = new Map([
	[ParseTreeTokenType.ARG_LIST, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.ARRAY_SUBSCRIPT, isLastChildType(ParseTreeTokenType.SQUARE_RIGHT_BRACKET)],
	[ParseTreeTokenType.CODE_BLOCK, isCompleteCodeBlock],
	[ParseTreeTokenType.COMPOSITE_LITERAL_VALUE, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.FOR, isLastChildType(ParseTreeTokenType.CODE_BLOCK)],
	[ParseTreeTokenType.IMPORT, isImportComplete],
	[ParseTreeTokenType.IMPORT_PACKAGE_LIST, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.SELECT_BODY, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.STRUCT_VALUES_EXPRESSION, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.SWITCH_BODY, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
]);

export function isComplete(token) {
	if (noChildTypes.has(token.type))
		return MaybeDecided.Yes;
	const children = token.children;
	if (oneChildTypes.has(token.type)) {
		if (children.length >= 1)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
	if (twoChildTypes.has(token.type)) {
		if (children.length >= 2)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
	if (threeChildTypes.has(token.type)) {
		if (children.length < 3)
			return MaybeDecided.No;
	}

	const checker = completeCheckers.get(token.type);
	if (checker !== undefined) {
		return checker(token) ? MaybeDecided.Yes : MaybeDecided.No;
	}
	return MaybeDecided.Maybe;
};

export function isCompleteWithNext(prev, next) {
	if (typeof prev !== 'object' || prev === null)
		throw new Error(`prev must be an object but found ${prev}`);
	if (typeof next !== 'object' || next === null)
		throw new Error(`next must be an object but found ${next}`);

	const children = prev.children;
	const last = children[children.length - 1];
	const prevParent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	children.length === 2) {
		if (next.type === ParseTreeTokenType.BINARY_OPERATOR)
			return false;
	}
	if (next.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (next.val === '*' && last !== undefined && last.type === ParseTreeTokenType.ARG_LIST)
			return false;
		if (prevParent !== null) {
			if (isPossibleData(prev) && prevParent.type === ParseTreeTokenType.RETURN)
				return false;
			if (isComplete(prevParent) === MaybeDecided.No)
				return false;
		}
	}
	if (next.type === ParseTreeTokenType.DOT) {
		if (prev.type === ParseTreeTokenType.FUNC_CALL && prev.children.length === 2)
			return false;
	}
	if (prev.type === ParseTreeTokenType.IF && last !== undefined) {
		if (last.type === ParseTreeTokenType.CODE_BLOCK &&
		next.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		next.type !== ParseTreeTokenType.ELSE)
			return true;
	}
	if (prev.type === ParseTreeTokenType.RETURN) {
		if (children.length >= 1)
			return true;
	}
	if (prev.type === ParseTreeTokenType.CODE_BLOCK) {
		const first = children[0];
		if (first !== undefined && first.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return next.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
	}
	if (isComplete(prev) === MaybeDecided.Yes)
		return true;

	return false;
};