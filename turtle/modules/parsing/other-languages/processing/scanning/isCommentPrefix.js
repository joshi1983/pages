export function isCommentPrefix(s) {
	if (s === '' || s === '/')
		return true;
	if (s[0] !== '/')
		return false;

	// The following prefixes are explained at:
	// https://processing.org/reference/multilinecomment.html
	// https://processing.org/reference/comment.html
	if (s.startsWith('//') || s.startsWith('/*'))
		return true;
	return false;
};