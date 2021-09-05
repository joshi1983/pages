import { isReservedWord } from './isReservedWord.js';
import { isValidIdentifierPrefix } from './isValidIdentifierPrefix.js';
// Mentioned at https://developer.mozilla.org/en-US/docs/Glossary/Identifier
const invalidIdentifierWords = new Set([
	'undefined',
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