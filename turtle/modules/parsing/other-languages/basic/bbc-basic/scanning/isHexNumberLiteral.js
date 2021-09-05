const hexPattern = /^&[0-9a-f]+$/i;

export function isHexNumberLiteral(s) {
	return hexPattern.test(s);
};