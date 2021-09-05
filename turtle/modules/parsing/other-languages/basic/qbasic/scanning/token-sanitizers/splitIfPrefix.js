import { genericProcessSplit } from './genericProcessSplit.js';

function isPrefixOfInterest(s) {
	return s.length > 2 &&
		s.toLowerCase().startsWith('if');
}

function split(s) {
	return [s.substring(0, 2), s.substring(2)];
}

function isDisqualifying(s) {
	return s.toLowerCase() === 'if';
}

export function splitIfPrefix(scanTokens, customFunctionNames) {
	for (let i = 1; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (tok.s.toLowerCase() === 'then') {
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i - 1, -1, undefined, isDisqualifying);
		}
	}
};