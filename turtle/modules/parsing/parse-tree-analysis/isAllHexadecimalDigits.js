const hexOnlyExpression = /^[0-9A-Fa-f]*$/;

export function isAllHexadecimalDigits(s) {
	return hexOnlyExpression.test(s);
};