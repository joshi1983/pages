import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BYTES_LITERAL,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NONE,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.PASS,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
]);

const oneChildTypes = new Set([
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.NOT,
	ParseTreeTokenType.PRINT,
	ParseTreeTokenType.UNARY_OPERATOR
]);

const twoChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.IN
]);

function isCompleteCurvedBracketExpression(token) {
	const children = token.children;
	if (children.length === 0)
		return false;
	if (children[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return children[children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	return false;
}

function isIdentifierComplete(prev) {
	if (prev.parentNode.type === ParseTreeTokenType.CLASS)
		return true;
	if (prev.children.length === 0) {
		return false;
	}
	return true;
}

function isInComplete(prev) {
	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.FOR_LOOP)
		return true;
	return false;
}

function isCompleteSquareBracketExpression(token) {
	const children = token.children;
	if (children.length < 2)
		return false;
	if (children[0].type === ParseTreeTokenType.SQUARE_LEFT_BRACKET)
		return children[children.length - 1].type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET;
	return false;
}

function isCompleteReturn(token) {
	// return with 0 arguments can be complete too.
	// We'll see if any change is needed to reflect that later.
	return token.children.length >= 1;
};

const checkers = new Map([
	[ParseTreeTokenType.ARGUMENT_LIST, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete],
	[ParseTreeTokenType.IN, isInComplete],
	[ParseTreeTokenType.LIST_LITERAL, isCompleteSquareBracketExpression],
	[ParseTreeTokenType.RETURN, isCompleteReturn],
	[ParseTreeTokenType.TUPLE_LITERAL, isCompleteCurvedBracketExpression],
]);

export function isCompleteToken(token) {
	const checker = checkers.get(token.type);
	if (checker !== undefined)
		return checker(token);

	if (noChildTypes.has(token.type))
		return true;
	if (oneChildTypes.has(token.type))
		return token.children.length >= 1;
	if (twoChildTypes.has(token.type))
		return token.children.length >= 2;
	return false;
};