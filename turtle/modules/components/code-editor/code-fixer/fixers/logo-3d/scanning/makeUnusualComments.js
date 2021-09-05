const repeatedCharsForComments = new Set('=/'.split(''));

function isOfInterest(tokens, i) {
	const token = tokens[i];
	if (token.s.length !== 1)
		return false;
	const ch = token.s[0];
	if (!repeatedCharsForComments.has(ch))
		return false;
	const next = tokens[i + 1];
	if (next === undefined || next.lineIndex !== token.lineIndex)
		return false;
	if (next.s[0] !== ch)
		return false;
	return true;
}

function startSingleLineComment(tokens, i) {
	const token1 = tokens[i];
	const lineIndex = token1.lineIndex;
	let endIndex = i + 1;
	token1.s = ';' + token1.s;
	for (; endIndex < tokens.length; endIndex++) {
		const token = tokens[endIndex];
		if (token.lineIndex !== lineIndex ||
		token.s === '\n')
			break;

		token1.s += ' '.repeat(token.colIndex - token.s.length - token1.colIndex);
		token1.s += token.s;
		token1.colIndex = token.colIndex;
	}
	if (endIndex >= tokens.length)
		tokens.length = i + 1;
	else
		tokens.splice(i + 1, endIndex - i - 1); // remove the processed tokens.
}

export function makeUnusualComments(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			startSingleLineComment(tokens, i);
		}
	}
};