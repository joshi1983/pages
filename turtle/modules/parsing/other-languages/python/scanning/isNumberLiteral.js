import { isCompleteBinaryLiteral } from './isCompleteBinaryLiteral.js';
import { isCompleteHexLiteral } from './isCompleteHexLiteral.js';
import { isCompleteOctalLiteral } from './isCompleteOctalLiteral.js';
import { isComplexNumberLiteral } from './isComplexNumberLiteral.js';
import { isIntegerLiteral } from './isIntegerLiteral.js';
import { isStrictFloatLiteral } from './isStrictFloatLiteral.js';

export function isNumberLiteral(s) {
	return isCompleteBinaryLiteral(s) ||
		isCompleteHexLiteral(s) ||
		isCompleteOctalLiteral(s) ||
		isIntegerLiteral(s) ||
		isStrictFloatLiteral(s) ||
		isComplexNumberLiteral(s);
};