const numLiteralRegex = /^[+-]?[0-9]*(\.[0-9]*)?(e[+-]?[0-9]*)?$/;
const excludedRegex = /^[+-]?\.e$/i;

export function isNumberLiteral(s) {
	s = s.toLowerCase();
	if (s === '+' || s === '-' || s === '.' || s === '' || s === 'e')
		return false;
	if (excludedRegex.test(s))
		return false;
	return numLiteralRegex.test(s);
};