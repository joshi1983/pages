export function isBytesLiteralStart(s) {
	s = s.toLowerCase();
	if (s === 'b')
		return true;
	const start = s.substring(0, 2);
	if (start === 'b"' || start === 'b\'')
		return true;
	return false;
};