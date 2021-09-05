const pairsToJoin = [
	['not', '='],
	['>', '='],
	['<', '='],
	[':', '='],
];

function isOfInterest(tokens, i) {
	const token = tokens[i];
	const next = tokens[i + 1];
	if (next.lineIndex !== token.lineIndex)
		return false;

	const tokenS = token.s.toLowerCase();
	const nextS = next.s.toLowerCase();
	for (const [first, second] of pairsToJoin) {
		if (first === tokenS) {
			if (nextS === second)
				return true;
		}
	}
	return false;
}

export function removeSpacesInPairs(tokens) {
	for (let i = 0; i < tokens.length - 1; i++) {
		if (isOfInterest(tokens, i)) {
			const token = tokens[i];
			const next = tokens[i + 1];
			token.s += next.s;
			token.colIndex = next.colIndex;
			tokens.splice(i + 1, 1); // remove the next token.
		}
	}
};