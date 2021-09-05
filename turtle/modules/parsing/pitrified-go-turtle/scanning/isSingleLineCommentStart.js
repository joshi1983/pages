export function isSingleLineCommentStart(s) {
	if (s.startsWith('//'))
		return true;
	return false;
};