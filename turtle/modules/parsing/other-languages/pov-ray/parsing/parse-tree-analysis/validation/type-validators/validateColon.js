export function validateColon(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (token.val !== ':')
		parseLogger.error(`Expected val to be : but found ${token.val}`, token);
	if (token.children.length !== 0)
		parseLogger.error(`Expected colon to have no children but found ${token.children.length}`, token);
	if (parent === null)
		parseLogger.error(`Expected parent of : to not be null`, token);
		
};