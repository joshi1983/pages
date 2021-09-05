import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	return s.length > 4 &&
		s.toLowerCase().startsWith('wend');
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	return s === '=';
}

export function splitWendPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (i > 0) {
			const prev = scanTokens[i - 1];
			// if not likely to be a label, skip.
			if (!canBeIntegerLabel(prev.s))
				continue;
		}
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, 
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};