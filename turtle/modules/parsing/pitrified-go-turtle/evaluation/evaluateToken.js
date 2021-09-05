import { evaluateBooleanLiteral } from './evaluateBooleanLiteral.js';
import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteral],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral],
]);

export function evaluateToken(token) {
	const evaluator = evaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token);
};