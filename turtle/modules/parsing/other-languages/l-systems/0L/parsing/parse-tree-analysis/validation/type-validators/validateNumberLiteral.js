export function validateNumberLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length !== 0)
		parseLogger.error(`Expected 0 children for a NUMBER_LITERAL token but found ${children.length}`, token);
};