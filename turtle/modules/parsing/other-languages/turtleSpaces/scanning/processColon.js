const invalidNextValues = new Set(':()[]{}^,;*-+/'.split(''));

function isColonOfInterest(tokens, i) {
	const token = tokens[i];
	if (token.s[0] === ':') {
		const prev = tokens[i - 1];
		if (prev.s.toLowerCase() !== 'snappy')
			return false;

		if (token.s.length === 1) {
			const next = tokens[i + 1];
			if (next === undefined ||
			invalidNextValues.has(next.s[0]))
				return false;
		}

		return true;
	}
	return false;
}

export function processColon(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		if (isColonOfInterest(tokens, i)) {
			const prev = tokens[i - 1];
			const token = tokens[i];
			if (token.s.length === 1) {
				tokens.splice(i - 1, 2);
				i -= 3;
			}
			else {
				prev.s = token.s.substring(1);
				prev.colIndex = token.colIndex;
				prev.lineIndex = token.lineIndex;
				tokens.splice(i, 1);
				i -= 2;
			}
		}
	}
};