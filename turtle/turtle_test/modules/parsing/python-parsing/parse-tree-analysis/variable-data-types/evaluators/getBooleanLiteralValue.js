export function getBooleanLiteralValue(token, tokenValues) {
	return token.val.toLowerCase() === 'true';
};