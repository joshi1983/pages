export function isBase10IntegerLiteral(s) {
	return /^-?(\d_?)*\d$/.test(s);
};

export function isBinaryIntegerLiteral(s) {
	return /^0b(_?[01])+$/i.test(s);
};

export function isHexIntegerLiteral(s) {
	return /^0x(_?[0-9a-f])+$/i.test(s);
};

export function isOctalIntegerLiteral(s) {
	return /^0o(_?[0-7])+$/i.test(s);
};

const checks = [
	isBase10IntegerLiteral,
	isBinaryIntegerLiteral,
	isHexIntegerLiteral,
	isOctalIntegerLiteral,
];

export function isCompleteIntegerLiteral(s) {
	return checks.some(check => check(s));
};