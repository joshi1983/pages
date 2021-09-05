const labelNames = new Set([
	'quit'
]);

function isOfInterest(tokens, i) {
	if (i > 0) {
		const prev = tokens[i - 1];
		const prevS = prev.s.toLowerCase();
		if (prevS === 'goto' ||
		prevS === 'gosub')
			return false;
	}
	const openBracket = tokens[i];
	if (openBracket.s !== '[')
		return false;

	const nameToken = tokens[i + 1];
	if (nameToken === undefined || !labelNames.has(nameToken.s.toLowerCase()))
		return false;

	const closeBracket = tokens[i + 2];
	if (closeBracket.s !== ']')
		return false;
	
	return true;
}

// for example, converts:
// [init]
// to
// init:
// "i" would be the index of token for [ in that example.
export function convertSquareBracketExpressionToQBasicLabel(tokens, i) {
	const nameToken = tokens[i + 1];
	const closeBracket = tokens[i + 2];
	closeBracket.s = ':';
	tokens.splice(i, 3, nameToken, closeBracket);
};

export function convertSpecificAnnotationsToLabels(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			convertSquareBracketExpressionToQBasicLabel(tokens, i);
		}
	}
};