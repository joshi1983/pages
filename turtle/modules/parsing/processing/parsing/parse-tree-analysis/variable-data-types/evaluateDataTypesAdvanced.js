import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const integerTypes = new Set(['int', 'long', 'short']);
const evaluators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, evaluateBinaryOperatorDataType],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, evaluateCurvedBracketExpressionDataType]
]);

function evaluateCurvedBracketExpressionDataType(token, tokenTypesMap) {
	if (token.children.length === 3) {
		const middleToken = token.children[1];
		return tokenTypesMap.get(middleToken);
	}
}

function plusTypes(token, tokenTypesMap) {
	const children = token.children;
	if (children.length === 0)
		return;
	const op1Type = tokenTypesMap.get(children[0]);
	if (children.length === 1)
		return op1Type;
	const op2Type = tokenTypesMap.get(children[1]);
	if (op1Type === 'String' || op2Type === 'String')
		return 'String';
	if (op1Type === undefined || op2Type === undefined)
		return; // unknown type
	if (integerTypes.has(op1Type) && integerTypes.has(op2Type))
		return 'int';
	return 'float';
}

function evaluateBinaryOperatorDataType(token, tokenTypesMap) {
	if (token.val === '+')
		return plusTypes(token, tokenTypesMap);
}

function evaluateDataType(token, tokenTypesMap) {
	const evaluator = evaluators.get(token.type);
	return evaluator(token, tokenTypesMap);
}

export function evaluateDataTypesAdvanced(cachedParseTree, result) {
	let remainingTokens = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION
	]);
	let continueEvaluating = true;
	while (continueEvaluating) {
		continueEvaluating = false;
		remainingTokens = remainingTokens.filter(t => !result.has(t));
		for (const token of remainingTokens) {
			const dataType = evaluateDataType(token, result);
			if (dataType !== undefined) {
				result.set(token, dataType);
				continueEvaluating = true;
			}
		}
	}
};