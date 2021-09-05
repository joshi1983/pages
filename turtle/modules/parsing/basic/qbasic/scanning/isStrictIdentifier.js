import { isIdentifier } from './isIdentifier.js';
import { QBasicKeywords } from '../QBasicKeywords.js';

const unstrictIdentifiers = new Set([
	'end'
]);

export function isStrictIdentifier(s) {
	if (!isIdentifier(s) || unstrictIdentifiers.has(s.toLowerCase()))
		return false;
	return !QBasicKeywords.isKeyword(s);
};