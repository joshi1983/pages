import { isIdentifier } from './isIdentifier.js';
import { QBasicKeywords } from '../QBasicKeywords.js';
import { QBasicOperators } from '../QBasicOperators.js';

const unstrictIdentifiers = new Set([
	'end'
]);

export function isStrictIdentifier(s) {
	if (!isIdentifier(s) || unstrictIdentifiers.has(s.toLowerCase()) ||
	QBasicOperators.getOperatorInfo(s) !== undefined)
		return false;
	return !QBasicKeywords.isKeyword(s);
};