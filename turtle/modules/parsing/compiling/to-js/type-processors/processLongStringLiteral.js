export function processLongStringLiteral(token, result) {
	result.append('`' + token.val + '`');
};