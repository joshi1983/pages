import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { evaluateStringLiteral } from './evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral],
]);

export function evaluateToken(token) {
	const evaluator = evaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token);
};