const regex = /^&h[0-9a-f]*$/;
const regex2 = /^#([0-9a-f]+&?)?$/;

export function isHexNumberLiteralStart(s) {
	if (s.length === 0)
		return false;
	s = s.toLowerCase();
	if (s === '&')
		return true;
	return regex.test(s) ||
		regex2.test(s);
};