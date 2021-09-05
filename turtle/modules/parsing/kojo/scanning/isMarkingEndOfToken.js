import { isMarkingEndOfToken as isMarkingEndOfTokenProcessing } from
'../../processing/scanning/isMarkingEndOfToken.js';

export function isMarkingEndOfToken(prev, nextChar) {
	return isMarkingEndOfTokenProcessing(prev, nextChar);
};