export function isCommentStart(s) {
	if (s.startsWith('//'))
		return true;
	if (s.startsWith('/*'))
		return true;
	return false;
};