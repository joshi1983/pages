import { evaluateToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forToStepToken } from './forToStepToken.js';
import { forToStepValue } from './forToStepValue.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { valueToLiteralCode } from '../../../../../valueToLiteralCode.js';

const flippedOperators = new Map([
	['<', '>'],
	['<=', '>='],
	['>', '<'],
	['>=', '<=']
]);

function isLeftOperandMatched(operator, variableName) {
	const leftOperand = operator.children[0];
	return leftOperand.val === variableName && leftOperand.type === ParseTreeTokenType.IDENTIFIER;
}

export function translateProcessingForToWebLogoFor(forToken, result, settings) {
	const codeBlock = forTokenToCodeBlock(forToken);
	const initValue = forTokenToInitialValue(forToken);
	const initVariableName = forTokenToInitVariableName(forToken);
	const stepValue = forToStepValue(forToken);
	const conditionToken = forToConditionToken(forToken);
	const limitTokens = conditionToken.children.filter(t => t.type !== ParseTreeTokenType.IDENTIFIER || t.val !== initVariableName);
	const limitToken = limitTokens[0];
	const controlVariableLeft = isLeftOperandMatched(conditionToken, initVariableName);

	result.append(`for [ ${valueToLiteralCode(initVariableName)} ${initValue} `);
	let limitValue = evaluateToken(limitToken);
	if (limitValue === undefined) {
		processToken(limitToken, result, settings);
	}
	let operator = conditionToken.val;
	if (!controlVariableLeft) {
		const flippedOperator = flippedOperators.get(operator);
		if (flippedOperator !== undefined)
			operator = flippedOperator;
	}
	if (operator === '>') {
		if (limitValue === undefined)
			result.append(' + 1');
		else
			limitValue++;
	}
	else if (operator === '<') {
		if (limitValue === undefined)
			result.append(' - 1');
		else
			limitValue--;
	}
	if (limitValue !== undefined)
		result.append(' ' + limitValue);
	
	if (stepValue !== 1) {
		if (isNumber(stepValue))
			result.append('' + stepValue);
		else {
			const stepToken = forToStepToken(forToken);
			const stepVariableToken = stepToken.children[1];
			if (stepToken.val === '-=')
				result.append(' -');

			result.append(':' + stepVariableToken.val);
		}
	}
	result.append(' ] ');

	processToken(codeBlock, result, settings);
};