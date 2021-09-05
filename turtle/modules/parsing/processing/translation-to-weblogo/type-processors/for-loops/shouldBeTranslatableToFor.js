import { forTokenToConditionVariableName } from './forTokenToConditionVariableName.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToStepVariableName } from './forTokenToStepVariableName.js';
import { forToStepValue } from './forToStepValue.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function shouldBeTranslatableToFor(forToken) {
	const initValue = forTokenToInitialValue(forToken);
	const initVariableName = forTokenToInitVariableName(forToken);
	if (!isNumber(initValue))
		return false;

	const stepValue = forToStepValue(forToken);
	if (!isNumber(stepValue))
		return false;
	
	const stepVariableName = forTokenToStepVariableName(forToken);
	if (stepVariableName !== initVariableName)
		return false;

	const conditionVariableName = forTokenToConditionVariableName(forToken);
	if (conditionVariableName !== stepVariableName)
		return false;

	const conditionToken = forToConditionToken(forToken);
	if (conditionToken === null || conditionToken.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return false;
	
	const conditionVariableNameToken = conditionToken.children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER && t.val === conditionVariableName)[0];
	if (conditionVariableNameToken.children.length !== 0)
		return false;

	return true;
};