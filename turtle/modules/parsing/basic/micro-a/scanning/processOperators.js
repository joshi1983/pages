import { isComment } from
'../../qbasic/scanning/isComment.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

const replacements = new Map([
	['!', 'not'],
	['&', 'and'],
	['|', 'or']
]);

export function processOperators(scanTokens) {
	for (let i = 0; i < scanTokens.length ; i++) {
		const token = scanTokens[i];
		const s = token.s;
		if (s.length > 1 && !isComment(s)) {
			if (replacements.has(s[0])) {
				const afterS = s.substring(1);
				token.s = replacements.get(s[0]);
				scanTokens.splice(i + 1, 0, new Token(afterS, token.colIndex, token.lineIndex));
				token.colIndex -= afterS.length;
			}
			else if (replacements.has(s[s.length - 1])) {
				const beforeS = s.substring(0, s.length - 1);
				token.s = beforeS;
				scanTokens.splice(i + 1, 0, new Token(replacements.get(s[s.length - 1]), token.colIndex, token.lineIndex));
				token.colIndex -= beforeS.length;
			}
		}
		else if (replacements.has(s)) {
			token.s = replacements.get(s);
		}
	}
}