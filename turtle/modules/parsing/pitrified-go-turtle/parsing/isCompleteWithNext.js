import { MaybeDecided } from
'../../../MaybeDecided.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
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
]);
const oneChildTypes = new Set([
	ParseTreeTokenType.GO,
	ParseTreeTokenType.RANGE,
	ParseTreeTokenType.UNARY_OPERATOR,
]);
const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.FUNC_CALL
]);

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
	[ParseTreeTokenType.CODE_BLOCK, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.COMPOSITE_LITERAL_VALUE, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.FOR, isLastChildType(ParseTreeTokenType.CODE_BLOCK)],
	[ParseTreeTokenType.IMPORT, isImportComplete],
	[ParseTreeTokenType.IMPORT_PACKAGE_LIST, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.SWITCH_BLOCK, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
]);

function isComplete(token) {
	if (noChildTypes.has(token.type))
		return MaybeDecided.Yes;
	if (oneChildTypes.has(token.type)) {
		if (token.children.length >= 1)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
	if (twoChildTypes.has(token.type)) {
		if (token.children.length >= 2)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}

	const checker = completeCheckers.get(token.type);
	if (checker !== undefined) {
		return checker(token) ? MaybeDecided.Yes : MaybeDecided.No;
	}
	return MaybeDecided.Maybe;
}

export function isCompleteWithNext(prev, next) {
	if (isComplete(prev) === MaybeDecided.Yes)
		return true;
	
	return false;
};