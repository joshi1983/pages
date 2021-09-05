export function processComment(token, result) {
	result.append(';' + token.val.substring(2) + '\n');
};