export function isNumberLiteralStart(s) {
	if (s.length === 0)
		return false;

	if (s === '.')
		return true;

	if (/^-?[\d]*$/.test(s))
		return true;

	if (/^-?\d+\.\d*$/.test(s))
		return true;

	return false;
};