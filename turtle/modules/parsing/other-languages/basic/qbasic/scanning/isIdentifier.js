const identifierRegex = /^[a-z_][0-9a-z_]*([!%\$&#]|~%|&&)?$/i;

const specialIdentifiers = new Set(['?']);

export function isIdentifier(s) {
	if (specialIdentifiers.has(s))
		return true;

	// I couldn't find a maximum identifier length for QB64 or QBasic 
	// documented anywhere but
	// longer than this would be unreasonably long.
	// A length limit might mitigate the risk of "too much recursion" errors while
	// processing the regular expression.
	if (s.length > 100)
		return false;

	return identifierRegex.test(s);
};