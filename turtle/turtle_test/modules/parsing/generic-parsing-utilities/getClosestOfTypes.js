export function getClosestOfTypes(token, types) {
	if (types instanceof Array)
		types = new Set(types);
	while (token !== null && !types.has(token.type)) {
		token = token.parentNode;
	}
	return token;
};