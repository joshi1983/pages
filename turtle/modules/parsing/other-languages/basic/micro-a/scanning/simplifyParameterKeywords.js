import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'var')
		return false;

	const prev = scanTokens[i - 1];
	if (prev.s !== ',' && prev.s !== '(')
		return false; // not a function parameter so not of interest.

	const next = scanTokens[i + 1];

	// if the next token isn't a valid identifier,
	// it won't translate to a valid QBASIC DIM statement.
	if (!isIdentifier(next.s))  
		return false;
	return true;
}

export function simplifyParameterKeywords(scanTokens) {
	for (let i = scanTokens.length - 1; i >= 2; i--) {
		if (isOfInterest(scanTokens, i)) {
			scanTokens.splice(i, 1); // remove the keyword.
		}
	}
};