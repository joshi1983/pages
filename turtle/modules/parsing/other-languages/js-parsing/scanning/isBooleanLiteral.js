const booleanLiterals = new Set(['false', 'true']);

export function isBooleanLiteral(s) {
	return booleanLiterals.has(s);
};