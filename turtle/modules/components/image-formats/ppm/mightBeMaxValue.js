export function mightBeMaxValue(s) {
	s = s.trim();
	if (/\s/.test(s) || s === '' || s[0] === '0' || s.length > 5)
		return false;

	return !isNaN(parseInt(s));
};