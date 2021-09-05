const invokingStates = new Set([
405, 691]);

/*
This is a similar check to isNewLine, isIndent, isEndMarker...
except that I don't know of a good name for the type of token this is.
This checks for some tokens that are unwanted in the converted parse tree.
I just don't know of a good name for it.
I don't understand why the DTParse Tree even represented these tokens.
*/
export function isToBeIgnoredUnnamed(token) {
	if (token.children instanceof Array && token.children.length !== 0)
		return false;
	if (token.constructor.name !== 'TerminalNodeImpl')
		return false;
	if (typeof token.symbol !== 'object')
		return false;
	const text = token.symbol.text;
	if (typeof text !== 'string' || text.length !== 1 ||
	/\s/.test(text))
		return false;
	return invokingStates.has(token.invokingState);
};