export function processVariableReference(token, result) {
	if (!result.endsWithAndNotAcomment(' '))
		result.append(' ');
	result.append(`:${token.val.substring(1)} `);
};