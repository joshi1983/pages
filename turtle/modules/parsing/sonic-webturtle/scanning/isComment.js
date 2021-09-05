export function isComment(s) {
	if (s === null)
		return false;
	return s.startsWith(';') ||
		s.startsWith('#');
};