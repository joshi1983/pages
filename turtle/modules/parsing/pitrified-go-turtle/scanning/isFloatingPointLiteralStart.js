function isBase10FloatLiteralStart(s) {
	if (s[0].toLowerCase() === 'e')
		return false;
	return (/^(\d_?)*(\.(\d_?)*)?(e[-+]?(\d_?)*)?$/i.test(s))
}

function isHexFloatLiteralStart(s) {
	if (s.length < 2)
		return false;
	if (s.toLowerCase() === '0x')
		return true;
	return (/^0x_?([\da-f]_?)*(\.([\da-f]_?)*)?(p[-+]?[\da-f]*)?$/i.test(s));
}

function isOctalFloatLiteralStart(s) {
	if (s.length < 2)
		return false;
	if (s.toLowerCase() === '0o')
		return true;
	
	return /0o_?([0-7]_?)*(\._?([0-7]_?)*)?/i.test(s);
}

const checks = [
	isBase10FloatLiteralStart,
	isHexFloatLiteralStart,
	isOctalFloatLiteralStart
];

export function isFloatingPointLiteralStart(s) {
	if (s === '')
		return false;
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);

	return checks.some(check => check(s));
};