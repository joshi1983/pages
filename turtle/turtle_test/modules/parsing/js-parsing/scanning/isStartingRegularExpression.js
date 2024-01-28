
export function isStartingRegularExpression(s) {
	if (s.length > 1) {
		const secondChar = s[1];
		if (secondChar === '/' || secondChar === '*')
			return false; // would start a comment instead of a regular expression
	}
	return s === '' ||
		s[0] === '/';
};