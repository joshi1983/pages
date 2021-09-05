export function evaluateCharacterLiteral(token) {
	const s = token.val;
	const ch = s[0];
	const lastChar = s[s.length - 1];
	if (ch === "'" && lastChar === ch) {
		let val1 = s.substring(1, s.length - 1);
		return val1;
	}
};