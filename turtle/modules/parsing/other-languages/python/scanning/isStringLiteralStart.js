export function isStringLiteralStart(s) {
	if (s[0] === '"')
		return true;
	if (s[0] === '\'')
		return true;
	return false;
};