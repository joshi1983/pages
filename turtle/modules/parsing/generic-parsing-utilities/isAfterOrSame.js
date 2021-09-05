
/*
The ParseTreeToken class has a similar isAfter method but 
we can't use it here because we want token1 and token2 to potentially be either a Token or ParseTreeToken.
We don't know if we even have 1 ParseTreeToken.
*/
export function isAfterOrSame(token1, token2) {
	if (token1 === null)
		throw new Error('token1 must not be null');
	if (token2 === null)
		throw new Error('token2 must not be null');
	if (token1.lineIndex > token2.lineIndex)
		return true;
	else if (token1.lineIndex < token2.lineIndex)
		return false;
	if (token1.colIndex >= token2.colIndex)
		return true;
	return false;
};
