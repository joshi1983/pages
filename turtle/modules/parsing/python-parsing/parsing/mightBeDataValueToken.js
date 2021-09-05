import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const valTypes = new Set([
	ParseTreeTokenType.AWAIT,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BYTES_LITERAL,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NONE,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function isDataValueTokenType(type) {
	return valTypes.has(type);
};

export function mightBeDataValueToken(token) {
	if (!valTypes.has(token.type))
		return false;
	if (isCompleteToken(token))
		return true;
	return token.type === ParseTreeTokenType.IDENTIFIER ||
		token.type === ParseTreeTokenType.COMMA_EXPRESSION;
};