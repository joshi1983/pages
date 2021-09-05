
const vals = new Set([
	null, '=', ':'
]);

export function validateAssignment(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (children.length !== 2)
		parseLogger.error(`Expected 2 children for an ASSIGNMENT token but found ${children.length}`, token);
	if (!vals.has(token.val)) {
		parseLogger.error(`Did not expect an ASSIGNMENT to have a val ${token.val}`, token);
	}
};