export function getArgCountFromScanTokens(scanTokens, i) {
	const next = scanTokens[i + 1];
	if (next === undefined)
		return 0;

	if (next.s !== '(')
		return; // indicate unknown number of parameters.

	let bracketLevel = 1;
	let nonBracketFound = false;
	let result = 1;
	// Guess number of parameters by counting commas at the top curved bracket nesting level.
	for (i += 2; i < scanTokens.length ;i++) {
		const tok = scanTokens[i];
		const s = tok.s;
		if (s === '(')
			bracketLevel++;
		else if (s === ',')
			result++;
		else if (s === ')') {
			bracketLevel--;
			if (bracketLevel === 0)
				break;
		}
		else
			nonBracketFound = true;
	}
	if (nonBracketFound === false)
		return 0;
	return result;
};