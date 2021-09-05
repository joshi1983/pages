import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function processCommentToken(token, result) {
	result.append('\n');
	if (token.type === ParseTreeTokenType.SINGLE_LINE_COMMENT) {
		result.append(';' + token.val.substring(2) + '\n');
	}
	else {
		let commentContent = token.val.substring(2);
		commentContent = commentContent.substring(0, commentContent.length - 2);
		const lines = commentContent.split('\n');
		for (const line of lines) {
			result.append(';' + line + '\n');
		}
	}
};