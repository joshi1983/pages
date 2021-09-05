import { isNumberLiteralStart } from './isNumberLiteralStart.js';

const incompleteNumbers = new Set([
	'-', '-.', '+', '+.', '.',
	'-&', '+&', '&',
	'&o', '-&o', '&h', '-&h'
]);

export function isCompleteNumberLiteral(s) {
	s = s.toLowerCase();
	if (incompleteNumbers.has(s))
		return false;
	return isNumberLiteralStart(s);
};