import { evaluateBinaryOperator } from './evaluateBinaryOperator.js';
import { evaluateColorLiteral } from './evaluateColorLiteral.js';
import { evaluateFunctionCall } from './evaluateFunctionCall.js';
import { evaluateIdentifier } from './evaluateIdentifier.js';
import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateNumberUnitLiteral } from './evaluateNumberUnitLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperator],
	[ParseTreeTokenType.COLOR_LITERAL, evaluateColorLiteral],
	[ParseTreeTokenType.FUNCTION_CALL, evaluateFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, evaluateIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.NUMBER_UNIT_LITERAL, evaluateNumberUnitLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral]
]);

export function evaluateToken(token) {
	if (token.type === ParseTreeTokenType.TREE_ROOT && token.children.length === 1)
		token = token.children[0];
	const evaluator = evaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token);
};