export function isOctalNumberLiteralStart(s) {
	return /^-?0o[0-7]*$/.test(s);
};