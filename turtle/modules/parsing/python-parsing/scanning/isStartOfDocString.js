export function isStartOfDocString(code, startIndex) {
	const ch = code[startIndex];
	if (ch !== '"' && ch !== '\'')
		return false;
	for (let i = 1; i < 3; i++) {
		if (code[startIndex + i] !== ch)
			return false;
	}
	return true;
};