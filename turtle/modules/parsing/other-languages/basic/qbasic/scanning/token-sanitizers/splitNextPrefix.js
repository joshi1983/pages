import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	if (s.length <= 4 || !s.toLowerCase().startsWith('next'))
		return false;

	const after = s.substring(4);
	return isStrictIdentifier(after);
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the screen4... line
	return true;
}

export function splitNextPrefix(scanTokens, customFunctionNames) {
	let forFound = false; // The next keyword is used in QBASIC's for-loops.
	// If we don't find the "for" keyword before "next", the "next" will not be split here.

	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const s = tok.s.toLowerCase();
		if (s.startsWith('for'))
			forFound = true;
		if (forFound && isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};