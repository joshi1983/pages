const invokingStates = new Set([
606, 192]);
/*
A rare token with text INDENT may not be one of the tokens we really care about.
To be extra safe, we're also checking invokingState for one of the numbers found while testing.
Hopefully we found all the numbers for the ones we're interested in.
*/

export function isIndent(token) {
	if (token.children instanceof Array && token.children.length !== 0)
		return false;
	const symbol = token.symbol;
	if (symbol === undefined || symbol === false)
		return false;
	const text = symbol.text;
	if (text !== 'INDENT')
		return false;

	return invokingStates.has(token.invokingState);
};