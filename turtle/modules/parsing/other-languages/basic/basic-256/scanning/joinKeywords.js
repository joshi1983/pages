function isEndWhile(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;
	const whileToken = scanTokens[i + 1];
	if (whileToken === undefined ||
	whileToken.s.toLowerCase() !== 'while' ||
	whileToken.lineIndex !== token.lineIndex)
		return false;
	return true;
}

function convertEndWhileToWend(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isEndWhile(scanTokens, i)) {
			const whileToken = scanTokens[i + 1];
			whileToken.s = 'wend';
			scanTokens.splice(i, 1);
		}
	}
}

export function joinKeywords(scanTokens) {
	convertEndWhileToWend(scanTokens);
};