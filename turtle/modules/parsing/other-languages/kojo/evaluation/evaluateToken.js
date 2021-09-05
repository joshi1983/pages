import { evaluateBinaryOperator } from './evaluateBinaryOperator.js';
import { evaluateBooleanLiteral } from './evaluateBooleanLiteral.js';
import { evaluateCharacterLiteral } from './evaluateCharacterLiteral.js';
import { evaluateExpressionDotProperty } from './evaluateExpressionDotProperty.js';
import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { evaluateUnaryOperator } from './evaluateUnaryOperator.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteral],
	[ParseTreeTokenType.CHARACTER_LITERAL, evaluateCharacterLiteral],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, evaluateExpressionDotProperty],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, evaluateUnaryOperator]
]);

export function evaluateToken(token) {
	const evaluator = evaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token);
};