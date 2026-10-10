export function sanitizeLineBreaks(s) {
	s = s.replace(/\r?\n/g , "\n");
	s = s.replace(/\r/g , "\n");
	return s;
};