export function processStringLiteral(token, result) {
	result.append('"' + token.val + '"');
};