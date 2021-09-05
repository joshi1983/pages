import { getBinaryOperatorValue } from './getBinaryOperatorValue.js';
import { getBooleanLiteralValue } from './getBooleanLiteralValue.js';
import { getCurvedBracketExpressionValue } from './getCurvedBracketExpressionValue.js';
import { getFunctionCallValue } from './getFunctionCallValue.js';
import { getListLiteralValue } from './getListLiteralValue.js';
import { getNoneValue } from './getNoneValue.js';
import { getNumberLiteralValue } from './getNumberLiteralValue.js';
import { getStringLiteralValue } from './getStringLiteralValue.js';
import { getUnaryOperatorValue } from './getUnaryOperatorValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

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
	[ParseTreeTokenType.FUNCTION_CALL, getFunctionCallValue],
	[ParseTreeTokenType.LIST_LITERAL, getListLiteralValue],
	[ParseTreeTokenType.TUPLE_LITERAL, getListLiteralValue],
	[ParseTreeTokenType.UNARY_OPERATOR, getUnaryOperatorValue]
]);

export { basicEvaluators, advancedEvaluators };

export function getTokenValue(token, tokenToValueMap) {
	let evaluator = basicEvaluators.get(token.type);
	if (evaluator === undefined)
		evaluator = advancedEvaluators.get(token.type);
	if (evaluator !== undefined)
		return evaluator(token, tokenToValueMap);
};