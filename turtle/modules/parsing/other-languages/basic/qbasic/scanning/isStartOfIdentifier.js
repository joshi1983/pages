import { isIdentifier } from './isIdentifier.js';
const identifierStartRegex = /^[a-z_][0-9a-z_]*[&|\~]?$/i;

export function isStartOfIdentifier(s) {
	if (isIdentifier(s))
		return true;
	if (s === '')
		return true;

	return identifierStartRegex.test(s);
};