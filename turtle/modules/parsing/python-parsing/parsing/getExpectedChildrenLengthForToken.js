import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.BYTES_LITERAL,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONTINUE,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FINALLY,
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
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.YIELD
]);

const twoChildTypes = new Set([
	ParseTreeTokenType.AS,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION
]);

const threeChildTypes = new Set([
	ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR,
	ParseTreeTokenType.ELIF
]);

export function getExpectedChildrenLengthForToken(token) {
	if (noChildTypes.has(token.type))
		return 0;
	if (oneChildTypes.has(token.type))
		return 1;
	if (twoChildTypes.has(token.type))
		return 2;
	if (threeChildTypes.has(token.type))
		return 3;
};