const namesToRemove = new Set([
	'inits', 'intro'
]);

function isOfInterest(tokens, i) {
	if (i > 0) {
		const prev = tokens[i - 1];
		if (prev.s.toLowerCase() === 'gosub')
			return false;
	}
	
	const token = tokens[i];
	if (token.s !== '[')
		return false;

	const nameToken = tokens[i + 1];
	if (nameToken === undefined ||
	!namesToRemove.has(nameToken.s.toLowerCase()))
		return false;

	const closingBracket = tokens[i + 2];
	if (closingBracket === undefined ||
	closingBracket.s !== ']')
		return false;

	return true;
}

export function removeSpecificAnnotations(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			tokens.splice(i, 3);
		}
	}
};