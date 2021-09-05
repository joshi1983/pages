export function isStrictFloatLiteral(s) {
	return /^-?\d*\.\d*$/.test(s);
};