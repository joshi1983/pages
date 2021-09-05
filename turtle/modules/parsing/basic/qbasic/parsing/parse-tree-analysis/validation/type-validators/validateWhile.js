export function validateWhile(token, parseLogger) {
	const children = token.children;
	if (children.length === 0)
		parseLogger.error(`WHILE should have at least 1 child but found none`, token);
};