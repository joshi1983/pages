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

export const acceptableConditionOperators = new Set([
	'<', '<=', '>', '>=', '==', '!='
]);

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

	if (!conditionToken.children.some(t => t.type === ParseTreeTokenType.IDENTIFIER && t.children.length === 0))
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
	if (!acceptableConditionOperators.has(operator))
		return;

	if (operator === '==') {
		if (endValue === initValue) {
			return 1;
		}
		else
			return 0;
	}
	const r = (endValue - initValue) / stepValue;
	if (operator === '<' || operator === '<=') {
		if (Number.isInteger(r)) {
			if (operator === '<=')
				return r + 1;
			else
				return r;
		}
		return Math.floor(r);
	}
	if (operator === '>' || operator === '>=') {
		if (Number.isInteger(r)) {
			if (operator === '>=')
				return r + 1;
			else if (operator === '>')
				return r;
		}
		return Math.floor(r);
	}

	return Math.floor(endValue / stepValue);
};