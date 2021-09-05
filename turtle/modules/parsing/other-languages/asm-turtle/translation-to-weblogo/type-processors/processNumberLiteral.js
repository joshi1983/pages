export function processNumberLiteral(token, result) {
	result.trimRight();
	result.append(' ' + token.val + ' ');
};