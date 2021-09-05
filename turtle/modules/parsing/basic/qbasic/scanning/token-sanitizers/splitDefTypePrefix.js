import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';
import { sToTypePrefix } from './sToTypePrefix.js';

function isPrefixOfInterest(s) {
	const prefix = sToTypePrefix(s);
	return prefix !== undefined && s.length > prefix.length;
}

function split(s) {
	const prefix = sToTypePrefix(s);
	return [s.substring(0, prefix.length), s.substring(prefix.length)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s) ||
	s === ',' || s.toLowerCase() === 'as' ||
	isStrictIdentifier(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the defintx... line
	return true;
}

export function splitDefTypePrefix(scanTokens, customFunctionNames) {
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