import { isNumber } from '../../isNumber.js';

export function validateAspectRatio(aspectRatio) {
	if (aspectRatio !== undefined && isNumber(aspectRatio) === false)
		throw new Error(`aspectRatio must be undefined or a number.  Not: ${aspectRatio}`);
	if (aspectRatio <= 0)
		throw new Error(`aspectRatio must be more than 0 but given was ${aspectRatio}`);
};