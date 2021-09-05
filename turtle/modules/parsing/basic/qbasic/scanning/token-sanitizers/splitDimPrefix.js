import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	return s.length > 3 &&
		s.toLowerCase().startsWith('dim');
}

function split(s) {
	return [s.substring(0, 3), s.substring(3)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s) ||
	s === ',' || s.toLowerCase() === 'as' ||
	isStrictIdentifier(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the dimx... line
	return true;
}

export function splitDimPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (i > 0) {
			const prev = scanTokens[i - 1];
			// if not likely to be a label, skip.
			if (prev.lineIndex === tok.lineIndex && !canBeIntegerLabel(prev.s))
				continue;
		}
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};