export function isCompleteStringLiteral(s) {
	const ch = s[0];
	if (s.length < 2 || (ch !== '"' && ch !== '`'))
		return false;

	const lastChar = s[s.length - 1];
	return lastChar === ch;
};