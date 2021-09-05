import { isCompleteNumberLiteral as isCompleteNumberLiteralProcessing } from
'../../processing/scanning/isCompleteNumberLiteral.js';

export function isCompleteNumberLiteral(s) {
	return isCompleteNumberLiteralProcessing(s);
};