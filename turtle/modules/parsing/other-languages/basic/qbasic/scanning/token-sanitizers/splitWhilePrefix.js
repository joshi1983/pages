import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	return s.length > 5 &&
		s.toLowerCase().startsWith('while');
}

function split(s) {
	return [s.substring(0, 5), s.substring(5)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	return s === '=';
}

export function splitWhilePrefix(scanTokens, customFunctionNames) {
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