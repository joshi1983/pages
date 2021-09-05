export function isSingleLineComment(s) {
	if (s.startsWith('#'))
		return true;

	return false;
};