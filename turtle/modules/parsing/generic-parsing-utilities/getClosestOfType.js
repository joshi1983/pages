export function getClosestOfType(token, type) {
	while (token !== null && token.type !== type)
		token = token.parentNode;
	return token;
};