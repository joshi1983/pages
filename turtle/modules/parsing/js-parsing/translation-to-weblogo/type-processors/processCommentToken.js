function getCommentContent(s) {
	if (s.startsWith('//'))
		return s.substring(2);
	else if (s.startsWith('/*')) {
		s = s.substring(2);
		if (s.endsWith('*/'))
			s = s.substring(0, s.length - 2);
		return s;
	}
	return s;
}

export function processCommentToken(token, result) {
	const commentContent = getCommentContent(token.val);
	const lines = commentContent.split('\n');
	for (const line of lines) {
		result.append(';' + line + '\n');
	}
};