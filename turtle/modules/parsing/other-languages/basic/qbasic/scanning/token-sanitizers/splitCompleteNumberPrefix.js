import { genericProcessSplit } from './genericProcessSplit.js';
import { isCompleteNumberLiteral } from '../isCompleteNumberLiteral.js';

function getPrefixLength(s) {
	for (let len = s.length - 1; len > 0; len--) {
		if (isCompleteNumberLiteral(s.substring(0, len)))
			return len;
	}
	return 0;
}

function isPrefixOfInterest(s) {
	if (isCompleteNumberLiteral(s))
		return false;

	return getPrefixLength(s) !== 0;
}

function split(s) {
	const len = getPrefixLength(s);
	return [s.substring(0, len), s.substring(len)];
}

export function splitCompleteNumberPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isPrefixOfInterest(tok.s)) {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, 0, tok.lineIndex, undefined);
		}
	}
};