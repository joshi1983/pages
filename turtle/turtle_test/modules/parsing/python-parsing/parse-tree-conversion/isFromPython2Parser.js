export function isFromPython2Parser(token) {
	if (token === null)
		return;
	if (token.parser === undefined)
		return isFromPython2Parser(token.parentCtx);
	return token.parser.constructor.name === 'Python2Parser';
};