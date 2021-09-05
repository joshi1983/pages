import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';
import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';

function isPrefixOfInterest(s) {
	return s.length > 4 &&
		s.toLowerCase().startsWith('goto');
}

function mightBeLabel(scanTokens, i) {
	const token = scanTokens[i];
	const s = token.s;
	if (!canBeIntegerLabel(s))
		return false;

	const prev = scanTokens[i - 1];
	if (prev !== undefined && prev.lineIndex === token.lineIndex)
		return false;
	
	return true;
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the goto... line
	return true;
}

export function splitGotoPrefix(scanTokens, customFunctionNames) {
	const potentialLabels = new Set();
	for (let i = 0; i < scanTokens.length; i++) {
		if (mightBeLabel(scanTokens, i))
			potentialLabels.add(scanTokens[i].s);
	}
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const tail = tok.s.substring(4).toLowerCase();
		if (isPrefixOfInterest(tok.s) && (potentialLabels.has(tail) ||
		customFunctionNames.has(tail))) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};