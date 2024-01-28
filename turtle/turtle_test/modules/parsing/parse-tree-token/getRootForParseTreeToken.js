export function getRootForParseTreeToken(token) {
	while (token.parentNode !== null)
		token = token.parentNode;

	return token;
};