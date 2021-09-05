export function isHexNumberLiteralStart(s) {
	return /^-?0x[0-9a-f]*$/.test(s);
};