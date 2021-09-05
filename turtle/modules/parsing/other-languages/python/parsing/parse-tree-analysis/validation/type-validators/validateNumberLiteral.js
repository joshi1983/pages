import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.SUBSCRIPT,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
]);

export function validateNumberLiteral(token, parseLogger) {
	const parent = token.parentNode;
	if (!parentTypes.has(parent.type))
		parseLogger.error(`Did not expect a NUMBER_LITERAL ${token.val} to have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
};