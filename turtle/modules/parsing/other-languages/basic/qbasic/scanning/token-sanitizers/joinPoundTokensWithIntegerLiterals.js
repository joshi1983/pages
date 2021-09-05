export function joinPoundTokensWithIntegerLiterals(scanTokens) {
	for (let i = 0; i < scanTokens.length - 1; i++) {
		const token = scanTokens[i];
		if (token.s === '#') {
			const next = scanTokens[i + 1];
			if (next.lineIndex === token.lineIndex &&
			next.colIndex - next.s.length === token.colIndex &&
			/^\d+$/.test(next.s)) {
				next.s = '#' + next.s;
				scanTokens.splice(i, 1); // remove the '#' token that was joined into the next one.
			}
		}
	}
};