export function evaluateStringLiteral(token) {
	let s = token.val.substring(1);
	const lastChar = s[s.length - 1];
	if (lastChar === "'" || lastChar === '"')
		s = s.substring(0, s.length - 1);
	return s;
};