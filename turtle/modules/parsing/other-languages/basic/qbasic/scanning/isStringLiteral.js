const quotes = new Set('”“’"'.split(''));

export { quotes };

export function isStringLiteral(s) {
	return quotes.has(s[0]);
};