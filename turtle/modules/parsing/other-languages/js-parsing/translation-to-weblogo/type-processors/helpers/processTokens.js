export function processTokens(processToken, tokens, result, settings) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	for (const child of tokens) {
		processToken(child, result, settings);
		result.append(' ');
	}
};