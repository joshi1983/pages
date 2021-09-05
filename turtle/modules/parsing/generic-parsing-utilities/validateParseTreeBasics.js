export function validateParseTreeBasics(token, parseLogger) {
	const parent = token.parentNode;
	if (typeof parent !== 'object')
		parseLogger.error(`parentNode must be null or an object(a ParseTreeToken) but it is neither.  parentNode=${parent}`, token);
	for (const child of token.children) {
		if (child.parentNode !== token)
			parseLogger.error(`A token's child should be that child's parentNode.  child.parentNode = ${child.parentNode}`, token);
	}
};