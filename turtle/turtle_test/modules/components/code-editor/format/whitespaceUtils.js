import { tabSpaceEquivalent } from './formatConstants.js';

const whitespaceExpr = /\s/;

export function lastIndexOfWhitespace(s, maxIndex) {
	for (let i = maxIndex; i >= 0; i--) {
		if (whitespaceExpr.test(s.charAt(i)))
			return i;
	}
	return -1;
};

export function indexOfWhitespace(s, startIndex) {
	for (let i = startIndex; i < s.length; i++) {
		if (whitespaceExpr.test(s.charAt(i)))
			return i;
	}
	return -1;
};

/*
The return value is always <= index.
If any tabs are found, the return value will be < index.
*/
export function charIndexToTabConsiderateIndex(s, index) {
	let convertedIndex = 0;
	for (let i = 0; i < s.length; i++) {
		const c = s.charAt(i);
		if (c === '\t')
			convertedIndex += tabSpaceEquivalent;
		else
			convertedIndex++;
		if (convertedIndex > index)
			return i;
	}
	return s.length;
};