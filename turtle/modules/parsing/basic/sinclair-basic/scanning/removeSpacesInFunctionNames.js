import { isStrictIdentifier } from '../../qbasic/scanning/isStrictIdentifier.js';

function isOfInterest(scanTokens, i) {
	const prev = scanTokens[i - 1];
	if (prev.s.toLowerCase() !== 'fn')
		return false;
	const tok = scanTokens[i];
	if (tok.lineIndex !== prev.lineIndex)
		return false;
	if (!isStrictIdentifier(tok.s))
		return false;
	const next = scanTokens[i + 1];
	if (next !== undefined) { 
		return next.s === '(' && next.lineIndex === tok.lineIndex;
	}

	const prevPrev = scanTokens[i - 2];
	if (prevPrev === undefined)
		return false;

	return prevPrev.s.toLowerCase() === 'def';
}

export function removeSpacesInFunctionNames(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const prev = scanTokens[i - 1];
			const tok = scanTokens[i];
			prev.s = prev.s + '_' + tok.s;
			prev.colIndex += tok.s.length;
			scanTokens.splice(i, 1); // remove the next token.
		}
	}
};