export function isComment(s) {
	return s.startsWith('//') ||
	s.startsWith('/*');
};