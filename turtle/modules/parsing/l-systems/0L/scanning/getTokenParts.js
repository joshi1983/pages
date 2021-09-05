import { isArrowStart } from './isArrowStart.js';

export function getTokenParts(s) {
	if (s.length > 1 &&
	isArrowStart(s.substring(0, s.length - 1)) &&
	s[s.length - 1] !== '>')
		return s.split('');
	
	return [s];
};