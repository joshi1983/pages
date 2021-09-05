export function getHighestOfType(token, type) {
	let result = null;
	for (; token !== null; token = token.parentNode) {
		if (token.type === type)
			result = token;
	}
	return result;
};