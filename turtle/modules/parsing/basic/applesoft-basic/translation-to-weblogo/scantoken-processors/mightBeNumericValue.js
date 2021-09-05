import { isIdentifier } from
'../../../qbasic/scanning/isIdentifier.js';
import { isCompleteNumberLiteral } from
'../../../qbasic/scanning/isCompleteNumberLiteral.js';

export function mightBeNumericValue(s) {
	if (isIdentifier(s))
		return true;
	if (isCompleteNumberLiteral(s))
		return true;
	return false;
};