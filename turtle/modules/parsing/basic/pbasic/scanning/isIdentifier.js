import { isIdentifier as qbasicIsIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

export function isIdentifier(s) {
	return qbasicIsIdentifier(s);
};