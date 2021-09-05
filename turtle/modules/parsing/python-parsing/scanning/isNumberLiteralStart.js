export function isNumberLiteralStart(s) {
	if (s === '')
		return false;
	if (s === '-')
		return false;
	
	return /^-?\d*\.?\d*$/.test(s);
};