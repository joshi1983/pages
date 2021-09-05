export function isBytesLiteral(s) {
	s = s.toLowerCase();
	if (s[0] !== 'b' || s.length < 3)
		return false;
	const secondChar = s[1];
	if (secondChar !== '"' && secondChar !== '\'')
		return false;
	if (s[1] !== s[s.length - 1])
		return false;
	if (s[s.length - 2] !== '\\')
		return true; // the last quote is not escaped so it must be the end of the literal.
	if (s[s.length - 3] !== '\\')
		return false;
	return true;
};