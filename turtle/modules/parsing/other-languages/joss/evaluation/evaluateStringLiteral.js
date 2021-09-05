export function evaluateStringLiteral(token) {
	const s = token.val;
	const ch = s[0];
	const lastChar = s[s.length - 1];
	let len = s.length;
	let startIndex = 0;
	if (ch === '"') {
		startIndex = 1;
	}
	if (s.length > 1 && lastChar === '"')
		len--;
	return s.substring(startIndex, len);
};