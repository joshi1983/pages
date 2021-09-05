import { isStringLiteral, quotes } from './isStringLiteral.js';

const sReplacements = new Map([
	['–', '-']
]);

function replaceS(token) {
	const s = token.s;
	if (sReplacements.has(s))
		token.s = sReplacements.get(s);
	if (s[0] === '–') // looks like regular hyphen but it isn't.
		token.s = '-' + token.s.substring(1); // replace with normal hyphen.
}

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
		else
			replaceS(token);
	}
};