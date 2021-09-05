import { isOctalNumberLiteralStart } from './isOctalNumberLiteralStart.js';

export function isCompleteOctalLiteral(s) {
	if (!isOctalNumberLiteralStart(s))
		return false;
	if (s.endsWith('o') || s.endsWith('O'))
		return false;
	return true;
};