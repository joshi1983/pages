import { isNumberLiteral } from './isNumberLiteral.js';

export function isCompleteNumberLiteral(s) {
	if (!isNumberLiteral(s))
		return false;
	s = s.toLowerCase();
	if (s.startsWith('e') || s.endsWith('e') || s.endsWith('-') || s.endsWith('+'))
		return false;
	return true;
};