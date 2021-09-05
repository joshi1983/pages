import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const dataValueTypes = new Set([
	ParseTreeTokenType.ABSOLUTE_EXPRESSION,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function mightBeDataValue(token) {
	if (!dataValueTypes.has(token.type))
		return false;
	return true;
};