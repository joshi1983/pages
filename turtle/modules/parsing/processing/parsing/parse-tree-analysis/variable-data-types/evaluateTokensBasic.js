import { getTokensByType } from
'../../../../generic-parsing-utilities/getTokensByType.js';
import { numberLiteralToValue } from '../../../numberLiteralToValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { stringLiteralToValue } from '../../../stringLiteralToValue.js';

function evaluateBooleanLiteralTokens(cachedParseTree, result) {
	const booleanLiterals = getTokensByType(cachedParseTree, ParseTreeTokenType.BOOLEAN_LITERAL);
	for (const literal of booleanLiterals)
		result.set(literal, literal.val === 'true');
}

function evaluateNumberLiteralTokens(cachedParseTree, result) {
	const numberLiterals = getTokensByType(cachedParseTree, ParseTreeTokenType.NUMBER_LITERAL);
	for (const literal of numberLiterals)
		result.set(literal, numberLiteralToValue(literal.val));
}

function evaluateStringLiteralTokens(cachedParseTree, result) {
	const stringLiterals = getTokensByType(cachedParseTree, ParseTreeTokenType.STRING_LITERAL);
	for (const literal of stringLiterals)
		result.set(literal, stringLiteralToValue(literal.val));
}

export function evaluateTokensBasic(cachedParseTree) {
	const result = new Map();
	evaluateBooleanLiteralTokens(cachedParseTree, result);
	evaluateNumberLiteralTokens(cachedParseTree, result);
	evaluateStringLiteralTokens(cachedParseTree, result);
	return result;
};