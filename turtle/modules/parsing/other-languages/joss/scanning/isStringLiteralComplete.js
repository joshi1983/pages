export function isStringLiteralComplete(s) {
	if (s.length < 2 ||
	s[0] !== '"' ||
	s[s.length - 1] !== '"')
		return false;

	// FIXME: Does JOSS support escaping of quotes in string literals?
	// JOSS does not that I know.
	// That would be something to handle here, if it did, though.

	return true;
};