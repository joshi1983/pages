import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
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

function isCompleteExpressionToken(token) {
	if (token === null)
		return false;
	const expectedChildCount = getExpectedChildrenLengthForToken(token);
	if (expectedChildCount !== undefined && expectedChildCount > token.children.length)
		return false;
	if (expressionTokenTypes.has(token.type)) {
		return true;
	}
	if (token.parentNode !== null) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CONDITIONAL_TERNARY) {
			if (token.type === ParseTreeTokenType.QUESTION_MARK ||
			token.type === ParseTreeTokenType.COLON)
			return true;
		}
	}
	return false;
}

export function getTopCompleteExpressionToken(token) {
	while (isCompleteExpressionToken(token.parentNode))
		token = token.parentNode;
	return token;
};