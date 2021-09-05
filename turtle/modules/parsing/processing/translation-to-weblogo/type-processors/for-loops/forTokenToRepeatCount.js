import { evaluateToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToConditionVariableName } from './forTokenToConditionVariableName.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToStepVariableName } from './forTokenToStepVariableName.js';
import { forToStepValue } from './forToStepValue.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function forTokenToRepeatCount(forToken) {
	const initValue = forTokenToInitialValue(forToken);
	if (!isNumber(initValue))
		return;

	const stepValue = forToStepValue(forToken);
	if (!isNumber(stepValue))
		return;

	const conditionToken = forToConditionToken(forToken);
	if (conditionToken === null ||
	conditionToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	conditionToken.children.length !== 2)
		return;

	const initVarName = forTokenToInitVariableName(forToken);
	const conditionVarName = forTokenToConditionVariableName(forToken);
	const stepVarName = forTokenToStepVariableName(forToken);
	if (initVarName !== conditionVarName || stepVarName !== conditionVarName)
		return;

	const nonIdentifiers = conditionToken.children.filter(tok => tok.type !== ParseTreeTokenType.IDENTIFIER);
	if (nonIdentifiers.length !== 1)
		return;

	const endValue = evaluateToken(nonIdentifiers[0]);
	if (!isNumber(endValue))
		return;

	let operator = conditionToken.val;
	if (operator === '==') {
		if (endValue === initValue)
			return undefined;
		else
			return 0;
	}
	if (operator === '<' || operator === '<=') {
		const r = endValue / stepValue;
		if (operator === '<=' && Number.isInteger(r))
			return 1 + r;
		return Math.floor(r);
	}
	if (operator === '>' || operator === '>=') {
		const r = endValue / stepValue;
		if (operator === '>=' && Number.isInteger(r))
			return 1 + r;
		return Math.floor(endValue / stepValue);
	}

	return Math.floor(endValue / stepValue);
};