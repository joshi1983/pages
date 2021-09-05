function mightBeArraySubscriptStart(scanTokens, i) {
	if (i === 0)
		return false; // there must be a variable reference before it or a '[' can not be an array subscript.
	if (scanTokens[i].s !== '[')
		return false;

	const prevS = scanTokens[i - 1].s;
	if (prevS === '[' || prevS === '(' || prevS === '{')
		return false;
	return true;
}

function mightBeArraySubscriptClose(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s !== ']' || i < 2)
		return false;
	return true;
}

export function convertSquareBracketsForArrays(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (mightBeArraySubscriptStart(scanTokens, i)) {
			token.s = '(';
		}
		else if (mightBeArraySubscriptClose(scanTokens, i))
			token.s = ')';
	}
};