export function isComplexNumberLiteral(s) {
	return /^-?\d*\.?\d*j$/.test(s);
};