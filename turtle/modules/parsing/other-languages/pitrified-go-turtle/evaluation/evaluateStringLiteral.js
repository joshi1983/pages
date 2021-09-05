export function evaluateStringLiteral(token) {
	const s = token.val;
	const ch = s[0];
	const lastChar = s[s.length - 1];
	if ((ch === '"' || ch === '\`') && lastChar === ch) {
		let val1 = s.substring(1, s.length - 1);
		if (ch === '"')
			return val1;
		else {
			// look for template substitution since we can't evaluate them.
			if (val1.indexOf('${') !== -1)
				return;
			return val1;
		}
	}
};