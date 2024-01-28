/*
token is expected to be a DT Parse token or context.
token must not be a ParseTreeToken.
*/
export function getStartIndex(token) {
	if (typeof token.symbol === 'object')
		token = token.symbol;
	if (Number.isInteger(token.start))
		return token.start;
	if (!(token.children instanceof Array)) {
		if (typeof token.start === 'object' && Number.isInteger(token.start.start)) {
			return token.start.start;
		}
		console.error(token);
		throw new Error(`token.children expected to be an Array but got ${token.children}`);
	}
	if (token.children.length !== 0)
		return getStartIndex(token.children[0]);
	console.error('Unable to get start for: ', token);
};