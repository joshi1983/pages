import { isIdentifier } from './isIdentifier.js';

export function isAnnotationStart(s) {
	if (s[0] !== '@')
		return false;
	if (s === '@')
		return true;
	return isIdentifier(s.substring(1));
};