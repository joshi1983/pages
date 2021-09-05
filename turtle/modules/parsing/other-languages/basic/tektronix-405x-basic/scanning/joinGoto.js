function isOfInterest(scanTokens, i) {
	const finalToken = scanTokens[i - 2];
	if (finalToken.s.toLowerCase() !== 'go')
		return false;
	const removedToken = scanTokens[i - 1];
	if (removedToken.s.toLowerCase() !== 'to')
		return false;

	const labelToken = scanTokens[i];
	if (!/^\d+$/.test(labelToken.s))
		return false;

	return true;
}

/*
Converts things like 'go to 120' to 'goto 120' 
which is closer to how goto statements are written in QBasic.
*/
export function joinGoto(scanTokens) {
	for (let i = 2; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const finalToken = scanTokens[i - 2];
			const removedToken = scanTokens[i - 1];
			finalToken.s += scanTokens[i - 1].s;
			finalToken.colIndex = removedToken.colIndex;
			finalToken.lineIndex = removedToken.lineIndex;
			scanTokens.splice(i - 1, 1);
		}
	}
};