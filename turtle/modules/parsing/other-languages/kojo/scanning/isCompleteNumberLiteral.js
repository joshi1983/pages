function isCompleteBase10Number(s) {
	if (/^\d+$/.test(s))
		return true;
	if (s === '.')
		return false;
	if (/^\d*\.\d*$/.test(s))
		return true;
	return false;
}

function isCompleteHexNumber(s) {
	return /^0x[\da-f]+$/i.test(s);
}

function isCompleteOctalNumber(s) {
	return /^0[1-7][0-7]*$/.test(s);
}

export function isCompleteNumberLiteral(s) {
	if (s[0] === '-' || s[0] === '+')
		s = s.substring(1);
	return isCompleteBase10Number(s) ||
		isCompleteHexNumber(s) ||
		isCompleteOctalNumber(s);
};