import { isNumberLiteralStart } from './isNumberLiteralStart.js';
import { isPreprocessorIdentifier } from './isPreprocessorIdentifier.js';
import { isStartOfIdentifier } from './isStartOfIdentifier.js';
import { isStartOfOperator } from './isStartOfOperator.js';

const breakingFunctions = [
	isPreprocessorIdentifier, isStartOfIdentifier, isNumberLiteralStart
];

export function isMarkingEndOfToken(s, nextChar) {
	for (const f of breakingFunctions) {
		if (f(s) && !f(s + nextChar))
			return true;
	}
	if (!isStartOfIdentifier(s + nextChar) && !isNumberLiteralStart(s)) {
		if (isStartOfOperator(s) && !isStartOfOperator(s + nextChar))
			return true;
	}

	return false;
};