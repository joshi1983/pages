import { isCommentStart } from './isCommentStart.js';

export function isCompleteComment(s) {
	return isCommentStart(s) && s[s.length - 1] === '\n';
};