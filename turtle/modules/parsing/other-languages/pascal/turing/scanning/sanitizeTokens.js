import { isNumberLiteralStart } from
'./isNumberLiteralStart.js';
import { runAllSanitizers } from
'./token-sanitizers/runAllSanitizers.js';

function sanitizeRangeDotDotOperator(tokens, i) {
	const token = tokens[i];
	if (isNumberLiteralStart(token.s) &&
	token.s.endsWith('.')) {
		const next = tokens[i + 1];
		if (next === undefined || next.s[0] !== '.' ||
		token.s.length < 2)
			return;

		if (next.lineIndex === token.lineIndex &&
		next.colIndex - next.s.length === token.colIndex) {
			token.s = token.s.substring(0, token.s.length - 1); // remove last character.
			token.colIndex--;
			next.s = '.' + next.s;
		}
	}
}

const sanitizers = [
	sanitizeRangeDotDotOperator
];

export function sanitizeTokens(tokens) {
	runAllSanitizers(tokens);
	for (let i = 0; i < tokens.length; i++) {
		for (const sanitize of sanitizers) {
			sanitize(tokens, i);
		}
	}
};