export function processVariableReference(token, result) {
	result.trimRight();
	result.append(' :' + token.val);
};