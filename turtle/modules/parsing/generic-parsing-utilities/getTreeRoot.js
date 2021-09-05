export function getTreeRoot(token) {
	while (token.parentNode !== null)
		token = token.parentNode;
	return token;
};