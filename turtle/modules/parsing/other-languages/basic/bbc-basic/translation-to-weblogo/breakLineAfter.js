export function breakLineAfter(scanTokens, index) {
	const tok = scanTokens[index];
	const next = scanTokens[index + 1];
	if (next !== undefined && next.lineIndex === tok.lineIndex) {
		for (let j = index + 1; j < scanTokens.length; j++) {
			scanTokens[j].lineIndex++;
		}
	}
};