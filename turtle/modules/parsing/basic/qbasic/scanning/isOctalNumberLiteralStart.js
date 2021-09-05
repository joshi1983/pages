const regex = /^&[o0][0-7]*$/;

export function isOctalNumberLiteralStart(s) {
	if (s.length === 0)
		return false;
	s = s.toLowerCase();
	if (s === '&')
		return true;
	return regex.test(s);
};