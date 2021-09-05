import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	s = s.toLowerCase();
	if (!s.startsWith('type'))
		return false;
	const after = s.substring(4);
	return after.length !== 0 &&
		isStrictIdentifier(after);
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the type4... line
	return true;
}

export function splitTypePrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, 
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};