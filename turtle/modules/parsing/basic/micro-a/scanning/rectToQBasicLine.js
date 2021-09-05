import { Token } from
'../../../Token.js';

function isOfInterest(scanTokens, i) {
	if (scanTokens[i].s.toLowerCase() !== 'rect')
		return false;

	// look for commas.
	for (let offset = 2; offset < 7; offset += 2) {
		const commaToken = scanTokens[i + offset];
		if (commaToken === undefined || commaToken.s !== ',')
			return false;
	}
	return true;
}

export function rectToQBasicLine(scanTokens) {
	for (let i = 0; i < scanTokens.length - 7; i++) {
		if (isOfInterest(scanTokens, i)) {
			const rectToken = scanTokens[i];
			const y1Token = scanTokens[i + 3];
			const middleCommaToken = scanTokens[i + 4];
			const x2Token = scanTokens[i + 5];
			const y2Token = scanTokens[i + 7];
			rectToken.s = 'line';
			const newTokens = scanTokens.slice(i + 1, i + 8);
			newTokens.splice(0, 0, new Token('(', rectToken.colIndex + 1, rectToken.lineIndex));
			newTokens.splice(4, 0, new Token(')', y1Token.colIndex + 1, y1Token.lineIndex));
			middleCommaToken.s = '-';

			newTokens.splice(6, 0, new Token('(', x2Token.colIndex - 1, x2Token.lineIndex));
			const suffixStrings = [')', ',', ',', 'BF'];
			for (let suffixIndex = 0; suffixIndex < suffixStrings.length; suffixIndex++) {
				const s = suffixStrings[suffixIndex];
				newTokens.push(new Token(s, y2Token.colIndex + suffixIndex + 1, y2Token.lineIndex));
			}

			scanTokens.splice(i + 1, 7, ...newTokens);
			i += newTokens.length;
		}
	}
};