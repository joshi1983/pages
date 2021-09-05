export function isCompleteComment(s) {
	if (s[0] !== '/')
		return false;
	if (s.startsWith('//') && s.endsWith('\n'))
		return true;
	if (s.startsWith('/*') && s.length > 3 && s.endsWith('*/'))
		return true;
	return false;
};