import { isValidIdentifier as isIdentifierProcessing } from
'../../processing/scanning/isValidIdentifier.js';

export function isIdentifier(s) {
	if (s === 'this')
		return true;
	return isIdentifierProcessing(s);
};