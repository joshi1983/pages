import { genericProcessSplit } from './genericProcessSplit.js';
import { isCompleteNumberLiteral } from '../isCompleteNumberLiteral.js';

function isPrefixOfInterest(s) {
	if (s.length > 4 &&
		s.toLowerCase().startsWith('step')) {
		const after = s.substring(4);
		if (isCompleteNumberLiteral(after))
			return true;
	}
	return false;
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

export function splitStepPrefix(scanTokens, customFunctionNames) {
	let stepExpected = false; // The step keyword is used in QBASIC's for-loops.
	// If we don't find the "for" keyword before "step", the "step" will not be split here.
	// If "step" or "next" is found after the last "for", we also won't split.
	// These extra checks prevent unwanted splits.

	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const s = tok.s.toLowerCase();
		if (s.startsWith('for'))
			stepExpected = true;
		else if (s === 'step' || s === 'next')
			stepExpected = false;
		if (stepExpected && isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, 
				split, i, 0, tok.lineIndex, undefined);
		}
	}
};