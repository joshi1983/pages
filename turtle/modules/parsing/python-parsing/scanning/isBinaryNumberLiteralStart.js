export function isBinaryNumberLiteralStart(s) {
	if (s === '0')
		return false;

	return /^-?0b[01]*$/.test(s);
};