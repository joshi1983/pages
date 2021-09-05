const invokingStates = new Set([612]);
/*
A rare token with text DEDENT may not be one of the tokens we really care about.
To be extra safe, we're also checking invokingState for one of the numbers found while testing.
Hopefully we found all the numbers for the ones we're interested in.
*/

export function isDedent(token) {
	if (token.children !== undefined && token.children.length !== 0)
		return false;
	const symbol = token.symbol;
	if (symbol === false)
		return false;
	const text = symbol.text;
	if (text !== 'DEDENT')
		return false;

	return invokingStates.has(token.invokingState);
};