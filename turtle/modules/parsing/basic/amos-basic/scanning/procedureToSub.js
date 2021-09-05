import { isIdentifier } from '../../qbasic/scanning/isIdentifier.js';

function isProcedureKeywordOfInterest(scanTokens, i) {
	if (i === scanTokens.length - 1)
		return false;

	const tok = scanTokens[i];
	if (tok.s.toLowerCase() !== 'procedure')
		return false;

	const next = scanTokens[i + 1];
	if (!isIdentifier(next.s))
		return false;

	return true;
}

function isEndProcOfInterest(scanTokens, i) {
	if (i === 0)
		return false;

	const prev = scanTokens[i - 1];
	const tok = scanTokens[i];
	return tok.s.toLowerCase() === 'proc' && prev.s.toLowerCase() === 'end';
}

/*
Converts keywords like 'procedure' to QBasic's 'sub'.
Also, converted 'end proc' to QBasic's 'end sub'.
*/
export function procedureToSub(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isProcedureKeywordOfInterest(scanTokens, i)) {
			tok.s = 'sub';
		}
		else if (isEndProcOfInterest(scanTokens, i)) {
			tok.s = 'sub';
		}
	}
};