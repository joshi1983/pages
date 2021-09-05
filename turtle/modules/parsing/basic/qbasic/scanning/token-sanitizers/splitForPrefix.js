import { genericProcessSplit } from './genericProcessSplit.js';
import { isStrictIdentifier } from '../isStrictIdentifier.js';

function isPrefixOfInterest(s) {
	if (!s.toLowerCase().startsWith('for'))
		return false;

	const after = s.substring(3);
	return isStrictIdentifier(after);
}

function split(s) {
	return [s.substring(0, 3), s.substring(3)];
}

function isQualifying(s) {
	return s.toLowerCase() === 'to' ||
		s.toLowerCase() === 'step';
}

export function splitForPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, split, i,
				1, tok.lineIndex, undefined, isQualifying);
		}
	}
};