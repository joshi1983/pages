const chars = new Set(':;[](){},'.split(''));
export function isSingleCharacterToken(ch) {
	return chars.has(ch);
};