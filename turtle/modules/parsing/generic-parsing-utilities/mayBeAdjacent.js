/*
Checks if the two specified tokens might be adjacent to each other.
The prevToken and nextToken are expected to be instances of the Token class defined in Token.js.
*/
export function mayBeAdjacent(prevToken, nextToken) {
	if (prevToken === undefined)
		return false;
	const s = nextToken.s;
	let lineIndex = nextToken.lineIndex;
	let colIndex = nextToken.colIndex;
	let lineIndexChanged = false;
	for (let i = s.length - 1; i >= 0; i--) {
		const ch = s[i];
		if (ch === '\n') {
			lineIndex--;
			lineIndexChanged = true;
		}
		else {
			colIndex--;
		}
	}
	if (prevToken.lineIndex !== lineIndex)
		return false;
	if (lineIndexChanged === false && prevToken.colIndex !== colIndex)
		return false;
	return true;
};