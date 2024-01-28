import { ArrayUtils } from '../../../../ArrayUtils.js';
import { getBinaryOperatorValue } from './evaluators/getBinaryOperatorValue.js';
import { getBooleanLiteralValue } from './evaluators/getBooleanLiteralValue.js';
import { getCurvedBracketExpressionValue } from './evaluators/getCurvedBracketExpressionValue.js';
import { getListLiteralValue } from './evaluators/getListLiteralValue.js';
import { getNoneValue } from './evaluators/getNoneValue.js';
import { getNumberLiteralValue } from './evaluators/getNumberLiteralValue.js';
import { getStringLiteralValue } from './evaluators/getStringLiteralValue.js';
import { getUnaryOperatorValue } from './evaluators/getUnaryOperatorValue.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const basicEvaluators = new Map([
	[ParseTreeTokenType.BOOLEAN_LITERAL, getBooleanLiteralValue],
	[ParseTreeTokenType.NONE, getNoneValue],
	[ParseTreeTokenType.NUMBER_LITERAL, getNumberLiteralValue],
	[ParseTreeTokenType.STRING_LITERAL, getStringLiteralValue],
	[ParseTreeTokenType.LONG_STRING_LITERAL, getStringLiteralValue],
]);

const advancedEvaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, getBinaryOperatorValue],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, getCurvedBracketExpressionValue],
	[ParseTreeTokenType.LIST_LITERAL, getListLiteralValue],
	[ParseTreeTokenType.TUPLE_LITERAL, getListLiteralValue],
	[ParseTreeTokenType.UNARY_OPERATOR, getUnaryOperatorValue]
]);

function evaluateLiteralsOnly(tokens, result) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const evaluator = basicEvaluators.get(token.type);
		if (evaluator !== undefined) {
			const val = evaluator(token);
			if (val !== undefined)
				result.set(token, val);
		}
	}
}

export function evaluateTokensBasic(cachedParseTree) {
	const result = new Map();

	// filter down to types that have a chance of being evaluated.
	const allTokens = cachedParseTree.getAllTokens().filter(tok =>
		basicEvaluators.has(tok.type) || advancedEvaluators.has(tok.type));

	// evaluate tokens that don't depend on previous calculations.
	evaluateLiteralsOnly(allTokens, result);

	// filter the evaluated tokens.
	ArrayUtils.remove(allTokens, token => !result.has(token));
	let continueLooping = true;
	while (continueLooping) {
		continueLooping = false;
		for (let i = 0; i < allTokens.length; i++) {
			const token = allTokens[i];
			const evaluator = advancedEvaluators.get(token.type);
			if (evaluator !== undefined) {
				const val = evaluator(token, result);
				if (val !== undefined) {
					result.set(token, val);
					continueLooping = true;
					// since this token was evaluated, this may help another token get evaluated on next pass.
				}
			}
		}
		ArrayUtils.remove(allTokens, token => !result.has(token));
	}
	return result;
};