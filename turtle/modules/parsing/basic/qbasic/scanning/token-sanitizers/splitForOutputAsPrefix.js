import { Token } from
'../../../../Token.js';

function isPrefixOfInterest(s) {
	s = s.toLowerCase();
	if (!s.startsWith('foroutputas'))
		return false;
	return true;
}

export function splitForOutputAsPrefix(scanTokens, customFunctionNames) {
	let lastOpenLineIndex = -1;
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const s = tok.s.toLowerCase();
		if (s === 'open')
			lastOpenLineIndex = tok.lineIndex;
		if (lastOpenLineIndex === tok.lineIndex &&
		isPrefixOfInterest(tok.s) &&
		!customFunctionNames.has(s)) {
			const s = tok.s.toLowerCase();
			const forToken = new Token(tok.s.substring(0, 3), tok.colIndex + 3 - s.length, tok.lineIndex);
			const outputToken = new Token(tok.s.substring(3, 'foroutput'.length), tok.colIndex + 'foroutput'.length - s.length, tok.lineIndex);
			if (s === 'foroutputas') {
				tok.s = tok.s.substring(tok.s.length - 2);
				scanTokens.splice(i, 1, forToken, outputToken, tok);
			}
			else if (s.startsWith('foroutputas')) {
				const asToken = new Token(tok.s.substring('foroutput'.length, 'foroutput'.length + 2),
					tok.colIndex + 'foroutput'.length - s.length, tok.lineIndex);
				tok.s = tok.s.substring('foroutputas'.length);
				scanTokens.splice(i, 1, forToken, outputToken, asToken, tok);
			}
		}
	}
};