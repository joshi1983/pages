import { evaluateBinaryOperator } from './evaluateBinaryOperator.js';
import { evaluateBooleanLiteral } from './evaluateBooleanLiteral.js';
import { evaluateCurvedBracketExpression } from './evaluateCurvedBracketExpression.js';
import { evaluateFunctionCall } from './evaluateFunctionCall.js';
import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { evaluateUnaryOperator } from './evaluateUnaryOperator.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteral],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, evaluateCurvedBracketExpression],
	[ParseTreeTokenType.FUNCTION_CALL, evaluateFunctionCall],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, evaluateUnaryOperator]
]);

export function evaluateToken(token) {
	const evaluate = evaluators.get(token.type);
	if (evaluate !== undefined)
		return evaluate(token);
};