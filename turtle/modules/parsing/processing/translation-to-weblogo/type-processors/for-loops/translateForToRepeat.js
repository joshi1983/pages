import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToRepeatCount } from './forTokenToRepeatCount.js';
import { forToStepValue } from './forToStepValue.js';
import { processToken } from '../processToken.js';

export function translateForToRepeat(forToken, result, settings) {
	const repeatLimit = forTokenToRepeatCount(forToken);
	const codeBlock = forTokenToCodeBlock(forToken);
	result.append('\nrepeat ');
	if (Number.isInteger(repeatLimit))
		result.append(repeatLimit + ' ');
	else {
		// process the expression.
		const stepValue = forToStepValue(forToken);
		const isDivideByStepValueNeeded = stepValue !== 1;
		if (isDivideByStepValueNeeded)
			result.append(' ( ');

		const conditionToken = forToConditionToken(forToken);
		const variableName = forTokenToInitVariableName(forToken);
		const limitToken = conditionToken.children.filter(t => t.val !== variableName)[0];
		processToken(limitToken, result, settings);

		if (isDivideByStepValueNeeded)
			result.append(` ) /  ${stepValue}`);
	}
	
	processToken(codeBlock, result, settings);
};