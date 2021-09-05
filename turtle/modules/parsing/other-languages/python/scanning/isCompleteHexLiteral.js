import { isHexNumberLiteralStart } from './isHexNumberLiteralStart.js';

export function isCompleteHexLiteral(s) {
	if (!isHexNumberLiteralStart(s))
		return false;
	if (s.endsWith('x') || s.endsWith('X'))
		return false;
	return true;
};