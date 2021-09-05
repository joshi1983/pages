export function isNumberLiteral(s) {
	return /^-?\d+(\.\d*)?$/.test(s);
};