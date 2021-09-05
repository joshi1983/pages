/*
Similar to isAfterOrSame but returns 3 types of results representing:
< 0 for less than.
=== 0 for equal
> 0 for greater than.

Also, no checks for null for slightly higher speed and cleaner code.

compareParseTokens is almost exactly the same as compareTokenLocations.
compareParseTokens just less validation and better performance.
*/

export function compareParseTokens(token1, token2) {
	if (token1.token !== undefined)
		token1 = token1.token;
	if (token2.token !== undefined)
		token2 = token2.token;
	if (token1.lineIndex > token2.lineIndex)
		return 2;
	else if (token1.lineIndex < token2.lineIndex)
		return -2;
	if (token1.colIndex > token2.colIndex)
		return 1;
	else if (token1.colIndex < token2.colIndex)
		return -1;
	return 0;
};