export function processEscapedLineBreak(prev, next) {
	// Don't add the escaped line breaks in the parse tree.
	return prev;
};