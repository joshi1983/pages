const identifierRegex = /^[a-z_][0-9a-z_]*(!|%|\$|&|&&|\~\%|#)?$/i;

export function isIdentifier(s) {
	return identifierRegex.test(s);
};