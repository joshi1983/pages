const previousStringsNotBeforeNumbers = new Set(['end', 'to']);

function isOfInterest(s) {
	if (s.startsWith(';'))
		return false;
	if (s === '\n')
		return false;
	return true;
}

function getLastTokenOfInterest(tokens) {
	for (let i = tokens.length - 1; i >= 0; i--) {
		const token = tokens[i];
		if (isOfInterest(token.s))
			return token;
	}
}

export function isNumberPossiblyExpected(tokens) {
	const lastTokenOfInterest = getLastTokenOfInterest(tokens);
	if (lastTokenOfInterest === undefined)
		return true;
	if (previousStringsNotBeforeNumbers.has(lastTokenOfInterest.s.toLowerCase()))
		return false;
	return true;
};