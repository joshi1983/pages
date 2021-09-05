export function processTranslationToCLS(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const prev = scanTokens[i - 1];
		if (token.s.toLowerCase() === 'mode' && prev.s.toLowerCase() === 'mode') {
			prev.s = 'CLS';
			scanTokens.splice(i, 1);
		}
	}
};