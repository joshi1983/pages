import { isBinaryNumberLiteralStart } from './isBinaryNumberLiteralStart.js';

export function isCompleteBinaryLiteral(s) {
	if (!isBinaryNumberLiteralStart(s))
		return false;
	if (s.endsWith('b'))
		return false;
	return true;
};