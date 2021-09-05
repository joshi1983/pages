import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToConditionVariableName } from './forTokenToConditionVariableName.js';
import { forToInitToken } from './forToInitToken.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToStepVariableName } from './forTokenToStepVariableName.js';
import { forToStepToken } from './forToStepToken.js';
import { forTokenCodeBlockContainsVariableReadUntranslatableToRepcount } from './forTokenCodeBlockContainsVariableReadUntranslatableToRepcount.js';
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

	return true;
};