import { isArrowStart } from './isArrowStart.js';
import { isNumberLiteral } from './isNumberLiteral.js';

export function getTokenParts(s) {
	if (isNumberLiteral(s))
		return [s];
	if (s.length > 1 &&
	isArrowStart(s.substring(0, s.length - 1)) &&
	s[s.length - 1] !== '>')
		return s.split('');
	
	return [s];
};