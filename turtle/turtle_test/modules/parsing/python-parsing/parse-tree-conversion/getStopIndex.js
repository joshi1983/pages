/*
token is expected to be a DT Parse token or context.
token must not be a ParseTreeToken.
*/
export function getStopIndex(token) {
	if (typeof token.symbol === 'object')
		token = token.symbol;
	if (Number.isInteger(token.stop))
		return token.stop;
	if (!(token.children instanceof Array)) {
		if (typeof token.stop === 'object' && Number.isInteger(token.stop.stop))
			return token.stop.stop;
		console.error(token);
		throw new Error('token.children expected to be an Array but got ${token.children}');
	}
	if (token.children.length !== 0)
		return getStopIndex(token.children[token.children.length - 1]);
	console.error('Unable to get stop for: ', token);
};