import { isCompleteNumberLiteral } from
'./isCompleteNumberLiteral.js';

const starts = new Set(['-', '+', '0x']);

export function isNumberLiteralStart(s) {
	if (isCompleteNumberLiteral(s))
		return true;

	if (starts.has(s))
		return true;
	if (s[0] === '-' || s[0] === '+')
		s = s.substring(1);
	return starts.has(s);
};