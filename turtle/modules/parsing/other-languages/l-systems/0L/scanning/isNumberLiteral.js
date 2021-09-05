const pattern = /^-?(\d+.?\d*|\d*.\d+)$/;

export function isNumberLiteral(s) {
	return pattern.test(s);
};