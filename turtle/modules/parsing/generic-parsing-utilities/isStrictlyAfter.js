// Checks if token1 is after token2.
export function isStrictlyAfter(token1, token2) {
	if (token1 === null)
		throw new Error('token1 must not be null');
	if (token2 === null)
		throw new Error('token2 must not be null');
	if (token1.lineIndex > token2.lineIndex)
		return true;
	else if (token1.lineIndex < token2.lineIndex)
		return false;
	if (token1.colIndex > token2.colIndex)
		return true;
	return false;
};
