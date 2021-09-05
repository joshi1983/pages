import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'var')
		return false;
	const prev = scanTokens[i - 1];
	if (prev !== undefined && (prev.s === ',' || prev.s === '('))
		return false; // likely a function parameter.

	const next = scanTokens[i + 1];

	// if the next token isn't a valid identifier,
	// it won't translate to a valid QBASIC DIM statement.
	if (!isIdentifier(next.s))  
		return false;
	return true;
}

export function varToDim(scanTokens) {
	for (let i = scanTokens.length - 2; i >= 0; i--) {
		if (isOfInterest(scanTokens, i)) {
			scanTokens[i].s = 'DIM';
		}
	}
};