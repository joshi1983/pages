
export function isBase10FloatLiteral(s) {
	if (/^-?((\d_?)*\d)?\.(\d(_?\d)*)?$/.test(s))
		return true;
	if (/^-?(\d_?)*(\.(_?\d)*)?e[+-]?\d(_?\d)*$/i.test(s))
		return true;
	
	return false;
};

export function isHexFloatLiteral(s) {
	if (/^0x(_?[0-9a-f])+\.(_?[0-9a-f])*$/i.test(s))
		return true;

	// if mantissa has a digit
	if (/^0x(_?[0-9a-f])+/i.test(s) || /^0x(_?[0-9a-f])*\.(_?[0-9a-f])+/i.test(s)) {
		if (/^0x(_?[0-9a-f])*(\.(_?[0-9a-f])*)?p[+-]?(_?[0-9a-f])+$/i.test(s))
			return true;
	}
	return false;
};

const checks = [
	isBase10FloatLiteral,
	isHexFloatLiteral
];

export function isCompleteFloatingPointLiteral(s) {
	return checks.some(check => check(s));
};