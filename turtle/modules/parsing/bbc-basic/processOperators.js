export function processOperators(scanTokens, operators) {
	if (!(operators instanceof Map))
		throw new Error(`operators must be a Map but found ${operators}`);

	for (const scanToken of scanTokens) {
		const s = scanToken.s;
		const newS = operators.get(s.toLowerCase());
		if (newS !== undefined)
			scanToken.s = newS;
	}
};