import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonDataTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ARRAY,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BY,
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSIF,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_PROCEDURE,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FORMAL_ARG_LIST,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.OF,
	ParseTreeTokenType.PROCEDURE,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.VAR,
	ParseTreeTokenType.WHEN
]);

export { nonDataTokenTypes };

export function canEvaluateToDataValue(token) {
	if (nonDataTokenTypes.has(token.type))
		return false;

	return true;
};