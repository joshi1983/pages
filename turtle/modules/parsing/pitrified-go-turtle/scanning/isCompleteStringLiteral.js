export function isCompleteStringLiteral(s) {
	if (s.length < 2 || s[0] !== '"')
		return false;

	const lastChar = s[s.length - 1];
	return lastChar === '"';
};