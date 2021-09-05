import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const expressionTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CONDITIONAL_TERNARY,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export { expressionTokenTypes };