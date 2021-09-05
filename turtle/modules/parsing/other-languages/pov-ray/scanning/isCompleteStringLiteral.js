export function isCompleteStringLiteral(s) {
	if (s.length < 2)
		return false;
	if (s[0] !== '"')
		return false;
	const lastChar = s[s.length - 1];
	if (lastChar !== '"')
		return false;
	for (let i = 1; i < s.length; i++) {
		let ch = s[i];
		if (ch === '\\')
			i++;
		if (i === s.length - 1)
			return true;
		ch = s[i];
		if (ch === '"' && s[i - 1] !== '\\')
			return false;
	}
	return false;
};