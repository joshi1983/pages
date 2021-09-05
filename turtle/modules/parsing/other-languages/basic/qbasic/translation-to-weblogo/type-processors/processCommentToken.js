export function processCommentToken(token, result) {
	result.append('\n');
	if (token.val.toLowerCase().startsWith('rem')) {
		result.append(';' + token.val.substring(3) + '\n');
	}
	else {
		let commentContent = token.val.substring(1);
		result.append(';' + commentContent + '\n');
	}
};