import { isStartingStringLiteral as isStringLiteralStartProcessing } from
'../../processing/scanning/isStartingStringLiteral.js';

export function isStringLiteralStart(s) {
	return isStringLiteralStartProcessing(s);
};