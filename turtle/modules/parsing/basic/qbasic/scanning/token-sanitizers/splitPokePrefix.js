import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isCompleteNumberLiteral } from
'../isCompleteNumberLiteral.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';

function isPrefixOfInterest(s) {
	s = s.toLowerCase();
	if (!s.startsWith('poke'))
		return false;
	const after = s.substring(4);
	return /^\d+$/.test(after);
}

function split(s) {
	return [s.substring(0, 4), s.substring(4)];
}

function isDisqualifying(s) {
	if (isComment(s) || isPrefixOfInterest(s) ||
	s === ',' || isStrictIdentifier(s) || isCompleteNumberLiteral(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the type4... line
	return true;
}

export function splitPokePrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const prev = scanTokens[i - 1];
		if (prev !== undefined && prev.s !== ':' &&
		!canBeIntegerLabel(prev.s))
			continue;
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, 
				split, i, 0, tok.lineIndex, isDisqualifying);
		}
	}
};