import { mightBeLineNumber } from
'./mightBeLineNumber.js';

const prevSOfInterest = new Set([':']);

function isOfInterest(tokens, i) {
	const token = tokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;

	const next = tokens[i + 1];
	if (next.lineIndex !== token.lineIndex ||
	next.s.toLowerCase() !== 'while')
		return false; // end while must be on the same line to be of interest.

	const prev = tokens[i - 1];
	if (prev.lineIndex === token.lineIndex &&
	!prevSOfInterest.has(prev.s)) {
		if (!mightBeLineNumber(prev.s))
			return false;
	}

	return true;
}

/*
QBasic uses 'wend' instead of 'end while' to mark the end of while-loops.
This converts the scanned tokens into more of what a QBasic would use.
*/
export function convertEndWhileToWend(tokens) {
	for (let i = 1; i < tokens.length - 1; i++) {
		if (isOfInterest(tokens, i)) {
			tokens[i].s = 'wend'; // replace 'end' with 'wend'.
			tokens.splice(i + 1, 1); // remove the 'end' token.
		}
	}
};