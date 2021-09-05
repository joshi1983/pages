const regex = /^-?[0-9]+(\.[0-9]+)?$/;

export function isNumberLiteral(s) {
	return regex.test(s);
};