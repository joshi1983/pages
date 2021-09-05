import { evaluateNumberLiteral } from './evaluateNumberLiteral.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const evaluators = new Map([
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral]
]);

export function evaluateToken(token) {
	const evaluator = evaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token);
};