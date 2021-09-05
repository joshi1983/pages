import { getIncrementStep } from './getIncrementStep.js';
import { getStartValue } from './getStartValue.js';
import { getStopValue } from './getStopValue.js';

export function getRepeatCount(token) {
	const stop = getStopValue(token);
	const start = getStartValue(token);
	const incrementStep = getIncrementStep(token);
	if (stop === undefined || start === undefined || incrementStep === undefined)
		return;
	if (stop === start)
		return 1;
	if (incrementStep === 0)
		return; // avoid division by zero.

	// The max is to ensure the result is always at least 0.
	return Math.max(0, (stop - start) / incrementStep);
};