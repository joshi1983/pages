const regex = /^[–-]?\d*\.?\d*[!%&#]?$/;
const exponentialRegex = /^[--]?(\d+|\d*\.\d+)e[-+]?\d+[!%&#]?$/i;

export function isBase10NumberLiteralStart(s) {
	if (s.length === 0)
		return false;
	if (s.length === 1 && '!#%&'.indexOf(s) !== -1)
		return false;
	if (exponentialRegex.test(s))
		return true;
	return regex.test(s);
};