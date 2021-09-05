
const untranslatableNames = new Set([
	'display', 'hide', 'open'
]);

function isUntranslatableScreenStatement(scanTokens, i) {
	const tok = scanTokens[i];
	if (tok.s.toLowerCase() !== 'screen')
		return false;

	if (i === scanTokens.length - 1)
		return true;

	const next = scanTokens[i + 1];
	return untranslatableNames.has(next.s.toLowerCase());
}

export function removeUntranslatableScreenStatements(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isUntranslatableScreenStatement(scanTokens, i)) {
			const screenToken = scanTokens[i];
			let endIndex, endTok;
			for (endIndex = i + 2; endIndex < scanTokens.length; endIndex++) {
				endTok = scanTokens[endIndex];
				if (endTok.s === ':') {
					endIndex++;
					break;
				}
				if (endTok.lineIndex !== screenToken.lineIndex) {
					break;
				}
			}
			scanTokens.splice(i, endIndex - i);
		}
	}
};