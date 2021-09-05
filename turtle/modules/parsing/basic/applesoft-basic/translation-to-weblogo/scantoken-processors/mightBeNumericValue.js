import { isIdentifier } from
'../../../qbasic/scanning/isIdentifier.js';
import { isNumberLiteralStart } from
'../../../qbasic/scanning/isNumberLiteralStart.js';

export function mightBeNumericValue(s) {
	if (isIdentifier(s))
		return true;
	if (isNumberLiteralStart(s))
		return true;
	return false;
};