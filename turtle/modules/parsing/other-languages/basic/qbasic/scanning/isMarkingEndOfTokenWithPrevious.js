import { isCompleteInternalFunctionName } from './isCompleteInternalFunctionName.js';

export function isMarkingEndOfTokenWithPrevious(prev, s, nextChar, lineIndex) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);
	if (!Number.isInteger(lineIndex))
		throw new Error(`lineIndex must be an integer but found ${lineIndex}`);

	if (!isCompleteInternalFunctionName(s))
		return false;

	if (prev !== undefined &&
	prev.lineIndex === lineIndex) {
		// if the previous token doesn't represent the start of a line or a label,
		// return false.
		if (prev.s !== ':' && !/^[1-9]\d*$/.test(prev.s)) {
			return false;
		}
	}
	return !isCompleteInternalFunctionName(s + nextChar);
};