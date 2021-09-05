import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function trimMultiLineComment(s) {
	s = s.substring(2);
	if (s.endsWith('*/'))
		s = s.substring(0, s.length - 2);
	return s;
}

export function processCommentToken(token, result) {
	if (token.type === ParseTreeTokenType.SINGLE_LINE_COMMENT)
		result.append(';' + token.val.substring(1) + '\n');
	else {
		const trimmedComment = trimMultiLineComment(token.val);
		for (const line of trimmedComment.split('\n')) {
			result.append(';' + line + '\n');
		}
	}
};