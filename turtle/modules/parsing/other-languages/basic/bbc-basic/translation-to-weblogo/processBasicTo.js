export function processBasicTo(scanTokens, functions) {
	if (!(functions instanceof Map))
		throw new Error(`functions must be a Map but found ${functions}`);

	for (const scanToken of scanTokens) {
		const s = scanToken.s;
		const newS = functions.get(s.toLowerCase());
		if (newS !== undefined)
			scanToken.s = newS;
	}
};