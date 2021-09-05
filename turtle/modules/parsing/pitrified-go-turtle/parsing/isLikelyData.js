import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const likelyTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CHARACTER_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function isLikelyData(token) {
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
	token.val === '*') {
		if (token.parentNode.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return false;
	}
	return likelyTypes.has(token.type);
};