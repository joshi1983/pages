export function processComment(token, result) {
	result.append('\n;' + token.val + '\n');
};