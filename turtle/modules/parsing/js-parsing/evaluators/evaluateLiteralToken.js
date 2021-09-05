import { evaluateArrayLiteralToken } from './evaluateArrayLiteralToken.js';
import { evaluateBooleanLiteralToken } from './evaluateBooleanLiteralToken.js';
import { evaluateNumberLiteralToken } from './evaluateNumberLiteralToken.js';
import { evaluateStringLiteralToken } from './evaluateStringLiteralToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const tokenEvaluators = new Map([
	[ParseTreeTokenType.ARRAY_LITERAL, evaluateArrayLiteralToken],
	[ParseTreeTokenType.BOOLEAN_LITERAL, evaluateBooleanLiteralToken],
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteralToken],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteralToken]
]);

export function evaluateLiteralToken(token) {
	const evaluator = tokenEvaluators.get(token.type);
	if (evaluator === undefined)
		return; // unable to evaluate.
	return evaluator(token);
};
