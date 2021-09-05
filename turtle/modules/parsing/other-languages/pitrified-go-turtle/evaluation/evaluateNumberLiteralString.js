function removeUnderscores(s) {
	let result = '';
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch !== '_')
			result += ch;
	}
	return result;
}

function evaluateHex(s) {
	s = s.substring(2);
	const decimalIndex = s.indexOf('.');
	const pIndex = s.indexOf('p');
	if (decimalIndex === -1 && pIndex === -1)
		return parseInt(s, 16);

	if (decimalIndex !== -1) {
		const leftPart = s.substring(0, decimalIndex);
		const leftVal = leftPart === '' ? 0 : parseInt(leftPart, 16);
		if (pIndex === -1) {
			const rightPart = s.substring(decimalIndex + 1);
			const rightVal = parseInt(rightPart, 16);
			return leftVal + rightVal / Math.pow(16, rightPart.length);
		}
		else {
			let fractionPart = s.substring(decimalIndex + 1, pIndex + 1 - decimalIndex);
			if (fractionPart[fractionPart.length - 1] === 'p')
				fractionPart = fractionPart.substring(0, fractionPart.length - 1);
			const fractionPartVal = fractionPart === '' ? 0 : parseInt(fractionPart, 16);
			const exp = parseInt(s.substring(pIndex + 1));
			const rightVal = fractionPartVal / Math.pow(16, fractionPart.length);
			return (leftVal + rightVal) * Math.pow(16, exp);
		}
	}
	const leftPart = s.substring(0, pIndex);
	const leftPartVal = leftPart === '' ? 0 : parseInt(leftPart, 16);
	const exp = parseInt(s.substring(pIndex + 1));
	return leftPartVal * Math.pow(16, exp);
}

function evaluateOctal(s) {
	s = s.substring(2);
	const decimalIndex = s.indexOf('.');
	if (decimalIndex === -1)
		return parseInt(s, 8);
	else {
		const fractionPart = s.substring(decimalIndex + 1);
		const fractionVal = parseInt(fractionPart, 8) / Math.pow(8, fractionPart.length);
		return parseInt(s.substring(0, decimalIndex), 8) + fractionVal;
	}
}

export function evaluateNumberLiteralString(s) {
	s = removeUnderscores(s).toLowerCase();
	const sign = s[0] === '-' ? -1 : 1;
	if (sign === -1)
		s = s.substring(1); // remove - prefix.
	if (s.endsWith('.'))
		s = s.substring(0, s.length - 1);
	if (s.startsWith('0x'))
		return sign * evaluateHex(s);
	else if (s.startsWith('0o'))
		return sign * evaluateOctal(s);
	return sign * parseFloat(s);
};