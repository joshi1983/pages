import { forToConditionToken } from './forToConditionToken.js';
import { forTokenCodeBlockContainsAssignmentsToControlVariable } from './forTokenCodeBlockContainsAssignmentsToControlVariable.js';
import { forTokenToConditionVariableName } from './forTokenToConditionVariableName.js';
import { acceptableConditionOperators } from './forTokenToRepeatCount.js';
import { forToInitToken } from './forToInitToken.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToStepVariableName } from './forTokenToStepVariableName.js';
import { forToStepToken } from './forToStepToken.js';
import { forTokenCodeBlockContainsVariableReadUntranslatableToRepcount } from './forTokenCodeBlockContainsVariableReadUntranslatableToRepcount.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { shouldTranslateToRepeatWithConstantLimit } from
'./shouldTranslateToRepeatWithConstantLimit.js';

export function shouldTranslateToRepeatWithLimitExpression(forToken) {
	if (shouldTranslateToRepeatWithConstantLimit(forToken))
		return false;

	const initVariableName = forTokenToInitVariableName(forToken);
	if (initVariableName === undefined)
		return false;

	const initToken = forToInitToken(forToken);

	const stepVariableName = forTokenToStepVariableName(forToken);
	if (stepVariableName !== initVariableName)
		return false;

	const stepToken = forToStepToken(forToken);

	const conditionVariableName = forTokenToConditionVariableName(forToken);
	if (conditionVariableName !== stepVariableName)
		return false;

	if (forTokenCodeBlockContainsVariableReadUntranslatableToRepcount(forToken))
		return false;

	const conditionToken = forToConditionToken(forToken);
	if (conditionToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	!acceptableConditionOperators.has(conditionToken.val))
		return false;

	const matchedConditionVariableToken = conditionToken.children.filter(t =>
		t.type === ParseTreeTokenType.IDENTIFIER && t.val === conditionVariableName && t.children.length === 0)[0];
	if (matchedConditionVariableToken === undefined)
		return false;

	if (forTokenCodeBlockContainsAssignmentsToControlVariable(forToken))
		return false;

	return true;
};