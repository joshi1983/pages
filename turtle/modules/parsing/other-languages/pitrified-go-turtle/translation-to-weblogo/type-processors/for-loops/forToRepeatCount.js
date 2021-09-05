import { evaluateToken } from '../../../evaluation/evaluateToken.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forToIncrementToken } from './forToIncrementToken.js';
import { forToInitToken } from './forToInitToken.js';
import { forToInitValue } from './forToInitValue.js';
import { forToStepNumber } from './forToStepNumber.js';
import { getVariableNameFromInitToken } from './getVariableNameFromInitToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function getVariableNameFromCondition(conditionToken) {
	const tokens = conditionToken.children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
	if (tokens.length === 1)
		return tokens[0].val;
}

function getVariableNameFromStep(stepToken) {
	if (stepToken.type === ParseTreeTokenType.IDENTIFIER)
		return stepToken.val;
	const tokens = stepToken.children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
	if (tokens.length === 1)
		return tokens[0].val;
}

function isVariableMismatched(initToken, conditionToken, stepToken) {
	const varName = getVariableNameFromInitToken(initToken);
	const varName2 = getVariableNameFromCondition(conditionToken);
	const stepVarName = getVariableNameFromStep(stepToken);
	return !(varName === varName2 && varName === stepVarName);
}

export function forToRepeatCount(forToken) {
	const children = forToken.children;
	const initToken = forToInitToken(forToken);
	const initValue = forToInitValue(forToken);
	const conditionToken = forToConditionToken(forToken);
	const stepToken = forToIncrementToken(forToken);
	const stepNumber = forToStepNumber(forToken);
	if (initToken === undefined)
		return;
	if (initToken.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return;
	if (initToken.children.length === 2) {
		const rightOperand = initToken.children[1];
		if (rightOperand.type === ParseTreeTokenType.RANGE &&
		rightOperand.children.length === 1) {
			return evaluateToken(rightOperand.children[0]);
		}
	}
	if (conditionToken === undefined ||
	conditionToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	conditionToken.val === '==')
		return;
	if (isVariableMismatched(initToken, conditionToken, stepToken))
		return;
	let finalValue;
	if (initValue !== undefined && stepNumber !== 0 && stepNumber !== undefined) {
		const numericOperands = conditionToken.children.filter(t => t.type === ParseTreeTokenType.NUMBER_LITERAL);
		if (numericOperands.length === 1)
			finalValue = evaluateToken(numericOperands[0]);
	}

	if (finalValue !== undefined && initValue !== undefined && stepNumber !== undefined && stepNumber !== 0) {
		let result = (finalValue - initValue) / stepNumber;
		if (conditionToken.val.length > 1 && conditionToken.val.endsWith('=') && Number.isInteger(result))
			result++;
		return Math.ceil(result);
	}
};