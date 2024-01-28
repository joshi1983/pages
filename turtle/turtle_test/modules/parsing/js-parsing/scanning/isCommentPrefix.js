export function isCommentPrefix(s) {
	if (s === '' || s === '/')
		return true;
	if (s[0] !== '/')
		return false;
	if (s.startsWith('//') || s.startsWith('/*'))
		return true;
	return false;
};