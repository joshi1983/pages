import { isMultilineCommentStart } from
'./isMultilineCommentStart.js';

export function isMultilineCommentComplete(s) {
	if (s.length < 4)
		return false;

	if (!isMultilineCommentStart(s))
		return false;
	
	return s.endsWith('*/');
};