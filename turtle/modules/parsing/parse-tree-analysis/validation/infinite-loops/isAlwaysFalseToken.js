export function isAlwaysFalseToken(token, cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	const val = tokenValues.get(token);
	return val !== undefined && !val;
};