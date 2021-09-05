import { isComplexNumberLiteral } from './isComplexNumberLiteral.js';
import { isIntegerLiteral } from './isIntegerLiteral.js';
import { isStrictFloatLiteral } from './isStrictFloatLiteral.js';

export function isNumberLiteral(s) {
	return isIntegerLiteral(s) ||
		isStrictFloatLiteral(s) ||
		isComplexNumberLiteral(s);
};