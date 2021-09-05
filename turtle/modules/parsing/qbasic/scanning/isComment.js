export function isComment(s) {
	if (s[0] === "'")
		return true;
	return /^REM(\s|$)/.test(s);
};