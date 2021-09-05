import { isCompleteIntegerLiteral } from './isCompleteIntegerLiteral.js';
import { isCompleteFloatingPointLiteral } from './isCompleteFloatingPointLiteral.js';

export function isImaginaryNumberLiteral(s) {
	if (s === '')
		return false;
	if (s[s.length - 1] !== 'i')
		return false;
	const truncated = s.substring(0, s.length - 1);
	return isCompleteFloatingPointLiteral(truncated) ||
		isCompleteIntegerLiteral(truncated);
};
