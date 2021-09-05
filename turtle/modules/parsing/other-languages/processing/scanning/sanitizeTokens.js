const replacements = new Map([
	['；', ';'] // this was a problem found at https://processing.org/reference/TWO_PI.html.
]);

export function sanitizeTokens(tokens) {
	for (const token of tokens) {
		const newS = replacements.get(token.s);
		if (newS !== undefined)
			token.s = newS;
	}
};