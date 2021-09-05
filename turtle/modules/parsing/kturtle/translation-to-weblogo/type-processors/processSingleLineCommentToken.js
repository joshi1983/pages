export function processSingleLineCommentToken(token, result) {
	if (result.endsWithAndNotAcomment('  '))
		result.removeFromTail(1);
	result.append(';');
	result.append(token.val.substring(1));
	result.append('\n');
};