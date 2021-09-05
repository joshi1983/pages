export function processComment(token, result) {
	if (token === null || token.val === null)
		throw new Error(`token must not be null and token.val must not be null but got token of ${token}`);
	result.append(';' + token.val.substring(1) + '\n');
};