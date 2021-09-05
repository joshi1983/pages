export function isStringLiteralStart(s) {
	if (s[0] !== '"')
		return false;
	
	return s.indexOf('"', 1) === -1;
};