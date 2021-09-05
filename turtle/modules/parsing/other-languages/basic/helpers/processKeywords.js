import { Token } from
'../../../generic-parsing-utilities/Token.js';

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
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const to = keywords.get(token.s.toLowerCase());
		if (to !== undefined) {
			if (to.indexOf(' ') === -1)
				token.s = to;
			else {
				const parts = to.split(' ');
				token.s = parts[0];
				const partTokens = [];
				for (let j = 1; j < parts.length; j++) {
					partTokens.push(new Token(parts[j],
						token.colIndex, token.lineIndex));
				}
				scanTokens.splice(i + 1, 0, ...partTokens);
				i += partTokens.length;
			}
		}
	}
};