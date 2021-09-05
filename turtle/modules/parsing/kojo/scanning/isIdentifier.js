import { isValidIdentifier as isIdentifierProcessing } from
'../../processing/scanning/isValidIdentifier.js';

export function isIdentifier(s) {
	return isIdentifierProcessing(s);
};