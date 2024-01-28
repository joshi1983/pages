const basePrefixes = [
	['0b', 1], // binary, base 2
	['0o', 3], // octal, base 8
	['0x', 4] // hexadecimal, base 16
];

function parsePowerOfTwo(s, bits) {
	let result = 0;
	for (let i = 0; i < s.length; i++) {
		result = result << bits;
		result = result | (s.charAt(i).charCodeAt(0) - '0'.charCodeAt(0));
	}
	return result;
}

function parseHex(s) {
	return parseInt(s, 16);
}

function getBasePrefix(s) {
	const isNegative = s.startsWith('-');
	let signPrefix = '';
	if (isNegative)
		signPrefix = '-';
	if (isNegative)
		s = s.substring(1);
	for (let i = 0; i < basePrefixes.length; i++) {
		if (s.startsWith(basePrefixes[i][0]))
			return {
				'prefix': signPrefix + basePrefixes[i][0],
				'powerOf2': basePrefixes[i][1]
			}
	}
}

export function parsePythonNumberLiteral(val) {
	if (typeof val !== 'string')
		return; // indicate unknown value.
	const baseInfo = getBasePrefix(val);
	if (baseInfo !== undefined) {
		val = val.substring(baseInfo.prefix.length);
		if (baseInfo.powerOf2 === 4)
			val = parseHex(val);
		else
			val = parsePowerOfTwo(val, baseInfo.powerOf2);
		if (baseInfo.prefix.charAt(0) === '-')
			val = -val;
	}
	else {
		val = parseFloat(val);
	}
	if (isNaN(val))
		return;
	return val;
};