import { evaluateArrayLiteralToken } from './evaluateArrayLiteralToken.js';
import { evaluateBinaryOperatorToken } from './evaluateBinaryOperatorToken.js';
import { evaluateBooleanLiteralToken } from './evaluateBooleanLiteralToken.js';
import { evaluateCurvedBracketExpressionToken } from './evaluateCurvedBracketExpressionToken.js';
import { evaluateNewToken } from './evaluateNewToken.js';
import { evaluateNullLiteralToken } from './evaluateNullLiteralToken.js';
import { evaluateNumberLiteralToken } from './evaluateNumberLiteralToken.js';
import { evaluateStringLiteralToken } from './evaluateStringLiteralToken.js';
import { evaluateUnaryOperatorToken } from './evaluateUnaryOperatorToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const tokenEvaluators = new Map([
	[ParseTreeTokenType.ARRAY_LITERAL, evaluateArrayLiteralToken],
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperatorToken],
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteralToken],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, evaluateCurvedBracketExpressionToken],
	[ParseTreeTokenType.NEW, evaluateNewToken],
	[ParseTreeTokenType.NULL, evaluateNullLiteralToken],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteralToken],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteralToken],
	[ParseTreeTokenType.UNARY_OPERATOR, evaluateUnaryOperatorToken]
]);

/*
Returns undefined when unable to evaluate the token completely.
*/
export function evaluateLiteralToken(token) {
	const evaluator = tokenEvaluators.get(token.type);
	if (evaluator === undefined)
		return; // unable to evaluate.
	return evaluator(token);
};
