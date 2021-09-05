import { isMultilineCommentStart } from
'./isMultilineCommentStart.js';

export function isComment(s) {
	return s[0] === '%' ||
	isMultilineCommentStart(s);
};