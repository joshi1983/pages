export function processKeywords(scanTokens, migrationInfo) {
	if (migrationInfo.keywords === undefined)
		return;

	const keywords = new Map();
	for (const keyword of migrationInfo.keywords) {
		let to = keyword.to;
		if (keyword.toSymbol !== undefined)
			to = keyword.toSymbol;

		if (to !== undefined) {
			keywords.set(keyword.from, to);
		}
	}
	for (const token of scanTokens) {
		const to = keywords.get(token.s.toLowerCase());
		if (to !== undefined)
			token.s = to;
	}
};