export function evaluateStringLiteralString(s) {
	if (s[0] === '"')
		s = s.substring(1);
	if (s[s.length - 1] === '"')
		s = s.substring(0, s.length - 1);
	return s;
};