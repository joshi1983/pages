import { isBinaryNumberLiteralStart } from './isBinaryNumberLiteralStart.js';
import { isHexNumberLiteralStart } from './isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from './isOctalNumberLiteralStart.js';

export function isNumberLiteralStart(s) {
		
	if (s === '')
		return false;
	if (s === '-')
		return false;

	if (isBinaryNumberLiteralStart(s) ||
	isHexNumberLiteralStart(s) ||
	isOctalNumberLiteralStart(s))
		return true;
	
	return /^-?\d*\.?\d*$/.test(s);
};