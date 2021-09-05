import { isBase10NumberLiteralStart } from './isBase10NumberLiteralStart.js';
import { isHexNumberLiteralStart } from './isHexNumberLiteralStart.js';

export function isNumberLiteralStart(s) {
	return isHexNumberLiteralStart(s) ||
		isBase10NumberLiteralStart(s);
};