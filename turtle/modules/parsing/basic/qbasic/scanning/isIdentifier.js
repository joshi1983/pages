const identifierRegex = /^[a-z_][0-9a-z_]*(!|%|\$|&|&&|\~\%|#)?$/i;

const specialIdentifiers = new Set(['?']);

export function isIdentifier(s) {
	if (specialIdentifiers.has(s))
		return true;
	return identifierRegex.test(s);
};