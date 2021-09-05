export function isCommentStart(s) {
	return s.startsWith('/*') || s.startsWith('//');
};