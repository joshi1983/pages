function isSpaceNeeded(s) {
	if (s.length === 0)
		return false;
	const ch = s[s.length - 1].toLowerCase();
	if (ch >= 'a' && ch <= 'z')
		return true;
	return false;
}

export function typesTokenToString(token) {
	let result = '';
	if (typeof token.val === 'string')
		result = token.val;
	for (const child of token.children) {
		if (isSpaceNeeded(result))
			result += ' ';
		result += typesTokenToString(child);
	}
	return result;
};