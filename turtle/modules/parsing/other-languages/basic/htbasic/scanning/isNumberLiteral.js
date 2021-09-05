import { isCompleteNumberLiteral
as qbIsNumberLiteral } from
'../../qbasic/scanning/isCompleteNumberLiteral.js';

export function isNumberLiteral(s) {
	if (s.indexOf('!') !== -1)
		return false;
		// HTBasic uses ! for comments so it can't be in a number literal.

	return qbIsNumberLiteral(s);
};