function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s !== '=')
		return false;
	const previous = scanTokens[i - 1];
	if (previous.s.length !== 1 || previous.lineIndex !== token.lineIndex)
		return false;
	const prevPrev = scanTokens[i - 2];
	if (prevPrev !== undefined && prevPrev.lineIndex === previous.lineIndex )
		return false;
	return true;
}

export function convertToArrows(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i))
			scanTokens[i].s = '->';
	}
};