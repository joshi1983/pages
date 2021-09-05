import { forToInitValue } from './forToInitValue.js';
import { forToRepeatCount } from './forToRepeatCount.js';
import { forToStepNumber } from './forToStepNumber.js';
import { getReadsForTranslation } from './getReadsForTranslation.js';

export function shouldTranslateToRepeat(forToken) {
	const reads = getReadsForTranslation(forToken);
	if (reads.size !== 0) {
		// Check that the value range matches what repcount would return.
		if (forToInitValue(forToken) !== 1)
			return false;
		if (forToStepNumber(forToken) !== 1)
			return false;
	}
	if (forToRepeatCount(forToken) !== undefined)
		return true;

	return false;
};