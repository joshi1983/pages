export function validateIf(token, parseLogger) {
	if (token.children.length < 1) {
		parseLogger.error(`Expected at least 1 children for IF but found ${token.children.length}`, token);
	}
};