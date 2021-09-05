import { isIdentifierStart } from './isIdentifierStart.js';
const pattern = /^-{0,2}[a-z_](-?[a-z_0-9]+)*$/i;

export function isCompleteIdentifier(s) {
	if (!isIdentifierStart(s))
		return false;
	if (s === '-')
		return false;
	return pattern.test(s);
};