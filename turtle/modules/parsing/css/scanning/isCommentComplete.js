import { isCommentStart } from './isCommentStart.js';

export function isCommentComplete(s) {
	if (!isCommentStart(s))
		return false;
	if (s.startsWith('//'))
		return s.endsWith('\n');
	return s.endsWith('*/');
};