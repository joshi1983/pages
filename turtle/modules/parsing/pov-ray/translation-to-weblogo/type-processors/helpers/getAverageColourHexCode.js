import { clamp } from '../../../../../clamp.js';

function digitsToUnsigned8(hexDigits) {
	return parseInt(hexDigits, 16);
}

function digits(val) {
	val = clamp(Math.round(val), 0, 255);
	let result = val.toString(16);
	if (result.length === 1)
		return '0' + result;
	else
		return result;
}

export function getAverageColourHexCode(colorHexes) {
	let r=0, g=0, b=0, a=0;
	for (let hex of colorHexes) {
		if (hex.length === 9) {
			a += digitsToUnsigned8(hex.substring(1, 3));
			let hex = hex.substring(2);
		}
		else
			a += 255;
		r += digitsToUnsigned8(hex.substring(1, 3));
		g += digitsToUnsigned8(hex.substring(3, 5));
		b += digitsToUnsigned8(hex.substring(5, 7));
	}
	const n = colorHexes.length;
	let result = digits(r/n) + digits(g/n) + digits(b/n);
	if (a > 254 * n) {
		return '#' + result;
	}
	else {
		return '#' + digits(a/n) + result;
	}
};