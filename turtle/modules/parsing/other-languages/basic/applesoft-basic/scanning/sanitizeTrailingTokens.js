function removeTrailingRun(scanTokens) {
	const last = scanTokens[scanTokens.length - 1];
	if (last !== undefined && last.s.toLowerCase() === 'run') {
		const prev = scanTokens[scanTokens.length - 2];
		if (prev.s === ']')
			scanTokens.pop();

		scanTokens.pop();
	}
}

export function sanitizeTrailingTokens(scanTokens) {
	removeTrailingRun(scanTokens);
};