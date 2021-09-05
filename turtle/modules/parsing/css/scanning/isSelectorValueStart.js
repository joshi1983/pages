import { isIdentifierStart } from './isIdentifierStart.js';

export function isSelectorValueStart(s) {
	if (isIdentifierStart(s))
		return true;
	return false;
};