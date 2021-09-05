import { isReservedWord } from './isReservedWord.js';
import { isValidIdentifierPrefix } from './isValidIdentifierPrefix.js';
const invalidIdentifierWords = new Set([
	'null'
]);

export function isValidIdentifier(s) {
	if (s === '')
		return false;
	if (invalidIdentifierWords.has(s))
		return false;
	if (isReservedWord(s))
		return false;
	if (isValidIdentifierPrefix(s))
		return true;
	return false;
};