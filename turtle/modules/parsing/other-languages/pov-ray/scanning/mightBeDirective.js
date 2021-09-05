import { isIdentifier } from './isIdentifier.js';

export function mightBeDirective(s) {
	if (s[0] !== '#')
		return false;
	return isIdentifier(s.substring(1));
};