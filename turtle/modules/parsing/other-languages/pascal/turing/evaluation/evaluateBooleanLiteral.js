export function evaluateBooleanLiteral(token) {
	return token.val.toLowerCase() === 'true';
};