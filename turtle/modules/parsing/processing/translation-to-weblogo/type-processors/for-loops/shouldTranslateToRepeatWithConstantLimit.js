import { forTokenToRepeatCount } from './forTokenToRepeatCount.js';
import { forTokenCodeBlockContainsVariableReadUntranslatableToRepcount } from './forTokenCodeBlockContainsVariableReadUntranslatableToRepcount.js';

export function shouldTranslateToRepeatWithConstantLimit(forToken) {
	const repeatCount = forTokenToRepeatCount(forToken);
	if (!Number.isInteger(repeatCount))
		return false;

	if (forTokenCodeBlockContainsVariableReadUntranslatableToRepcount(forToken))
		return false;

	return true;
};