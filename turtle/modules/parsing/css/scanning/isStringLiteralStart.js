import { isQuotedStringLiteralStart } from './isQuotedStringLiteralStart.js';

export function isStringLiteralStart(s) {
	if (s.startsWith('..'))
		return true;
	return isQuotedStringLiteralStart(s);
};