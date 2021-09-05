export function getDepth(token) {
	let result = 0;
	while (token !== null) {
		result++;
		token = token.parentNode;
	}
	return result;
};