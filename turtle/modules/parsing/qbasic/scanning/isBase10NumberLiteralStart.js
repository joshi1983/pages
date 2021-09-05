const regex = /^-?[0-9]*\.?[0-9]*[#]?$/;

export function isBase10NumberLiteralStart(s) {
	if (s.length === 0)
		return false;
	return regex.test(s);
};