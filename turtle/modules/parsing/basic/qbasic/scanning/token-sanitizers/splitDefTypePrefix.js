import { genericProcessSplit } from './genericProcessSplit.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';
import { sToTypePrefix } from './sToTypePrefix.js';

function isPrefixOfInterest(s) {
	const prefix = sToTypePrefix(s);
	if (prefix !== undefined && s.length > prefix.length) {
		const after = s.substring(prefix.length);
		return isStrictIdentifier(after);
	}
	return false;
}

function split(s) {
	const prefix = sToTypePrefix(s);
	return [s.substring(0, prefix.length), s.substring(prefix.length)];
}

export function splitDefTypePrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (i > 0) {
			const prev = scanTokens[i - 1];
			// if not likely to be a label, skip.
			if (prev.lineIndex === tok.lineIndex && !canBeIntegerLabel(prev.s) &&
			prev.s !== ':')
				continue;
		}
		if (isPrefixOfInterest(tok.s)) {
			const next = scanTokens[i + 1];
			if (next !== undefined && next.lineIndex === tok.lineIndex &&
			(next.s === '(' || next.s === '='))
				continue;
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, -1, tok.lineIndex, undefined);
		}
	}
};