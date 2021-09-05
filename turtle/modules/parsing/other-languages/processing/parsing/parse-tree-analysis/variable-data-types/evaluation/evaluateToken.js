import { evaluateBinaryOperator } from './evaluateBinaryOperator.js';
import { evaluateBooleanLiteral } from './evaluateBooleanLiteral.js';
import { evaluateIdentifier } from './evaluateIdentifier.js';
import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteral],
	[ParseTreeTokenType.IDENTIFIER, evaluateIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral],
]);

export function evaluateToken(token) {
	const evaluator = evaluators.get(token.type);
	if (evaluator === undefined)
		return;
	return evaluator(token);
};