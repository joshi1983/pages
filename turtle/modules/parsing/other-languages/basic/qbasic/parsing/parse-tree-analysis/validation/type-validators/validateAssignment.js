export function validateAssignment(token, parseLogger) {
	if (token.children.length !== 2) {
		parseLogger.error(`Expected ASSIGNMENT to have 2 children but found ${token.children.length}`, token);
	}
};