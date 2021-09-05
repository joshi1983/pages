/*
Similar to isValidProcedureName.
I'm keeping this implementation separate because they easily could be different.
It is hard to know what the real rules are by just testing at http://www.sonic.net/~nbs/webturtle/webturtle.cgi.
The documentation doesn't list all the rules for what is valid or invalid variable names.
*/
export function isValidVariableName(s) {
	if (s.trim() === '')
		return false;
	const ch = s[0];
	if (ch <= '9' && ch >= '0')
		return false;
	return true;
};