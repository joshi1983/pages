import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonDataTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ASSERT,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BODY,
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CONTAINER_TYPE,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DEFERRED,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSIF,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_MODULE,
	ParseTreeTokenType.END_PROCEDURE,
	ParseTreeTokenType.END_RECORD,
	ParseTreeTokenType.END_UNION,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FORK,
	ParseTreeTokenType.FORMAL_ARG_LIST,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.MODULE,
	ParseTreeTokenType.MODULE_BODY,
	ParseTreeTokenType.OF,
	ParseTreeTokenType.PROCEDURE,
	ParseTreeTokenType.RECORD,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.UNION,
	ParseTreeTokenType.VAR,
	ParseTreeTokenType.WHEN
]);

export { nonDataTokenTypes };

export function canEvaluateToDataValue(token) {
	if (nonDataTokenTypes.has(token.type))
		return false;

	return true;
};