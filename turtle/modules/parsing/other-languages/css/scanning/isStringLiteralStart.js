import { isQuotedStringLiteralStart } from './isQuotedStringLiteralStart.js';

export function isStringLiteralStart(s) {
	if (s.startsWith('..') || s.startsWith('./'))
		return true;
	if (s !== '/' && s[0] === '/' && s[1] !== '*' &&
	/\d/.test(s[1]) === false)
		return true;
	return isQuotedStringLiteralStart(s);
};