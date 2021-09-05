import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';
import { QBasicOperators } from
'../../QBasicOperators.js';
import { sToTypePrefix } from './sToTypePrefix.js';

function isPrefixOfInterest(s) {
	s = s.toLowerCase();
	if (s.length < 4 || !s.startsWith('def'))
		return false;

	const prefix = sToTypePrefix(s);
	return prefix === undefined && isStrictIdentifier(s.substring(3));
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the defnyt... line
	return true;
}

function split(s) {
	return [s.substring(0, 3), s.substring(3)];
}

export function splitDefPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const next = scanTokens[i + 1];
		if (next !== undefined) {
			if (QBasicOperators.getOperatorInfo(next.s) !== undefined)
				continue;
		}
		if (i > 0) {
			const prev = scanTokens[i - 1];
			// if not likely to be a label, skip.
			if (prev.lineIndex === tok.lineIndex && !canBeIntegerLabel(prev.s))
				continue;
		}
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, -1, tok.lineIndex, isDisqualifying);
		}
	}
};