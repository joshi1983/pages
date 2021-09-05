import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	return s.length > 6 &&
		s.toLowerCase().startsWith('screen');
}

function split(s) {
	return [s.substring(0, 6), s.substring(6)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the screen4... line
	return true;
}

export function splitScreenPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, 
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};