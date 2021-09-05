import { isBase10NumberLiteralStart } from './isBase10NumberLiteralStart.js';
import { isHexNumberLiteralStart } from './isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from './isOctalNumberLiteralStart.js';

export function isNumberLiteralStart(s) {
	return isHexNumberLiteralStart(s) ||
		isOctalNumberLiteralStart(s) ||
		isBase10NumberLiteralStart(s);
};