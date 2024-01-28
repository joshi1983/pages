export function getLastDescendentTokenOf(token) {
	while (token.children.length !== 0) {
		token = token.children[token.children.length - 1];
	}
	return token;
};