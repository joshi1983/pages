export function evaluateStringLiteral(token) {
	let s = token.val;
	const ch = s[0];
	if (ch === '"' || ch === '\'') {
		s = s.substring(1);
		if (s[s.length - 1] === ch)
			s = s.substring(0, s.length - 1);
	}
	return s;
};