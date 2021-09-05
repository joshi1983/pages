const conventionalStringEndingChars = new Set(' \t\n\r()'.split(''));

export function isMarkingEndOfToken(prev, nextChar) {
	if (nextChar === undefined)
		return true;
	if (prev[0] === '"') {
		if (conventionalStringEndingChars.has(nextChar))
			return true;
	}
	return false;
};