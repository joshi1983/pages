import { isStringLiteral, quotes } from './isStringLiteral.js';

// Make the quotes consistent.
// They may not be consistent if they were 
// copy/pasted from some websites or PDF documents.
function sanitizeStringLiteral(token) {
	let s = token.s;
	const firstChar = s[0];
	const lastChar = s[s.length - 1];
	if (quotes.has(firstChar))
		s = '"' + s.substring(1);
	if (quotes.has(lastChar))
		s = s.substring(0, s.length - 1) + '"';
	else if (lastChar !== '"') {
		s += '"';
		token.colIndex++;
	}

	token.s = s;
}

export function sanitizeTokens(tokens) {
	for (const token of tokens) {
		if (isStringLiteral(token.s))
			sanitizeStringLiteral(token);
	}
};