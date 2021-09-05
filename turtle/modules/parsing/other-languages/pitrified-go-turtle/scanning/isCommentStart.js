import { isSingleLineCommentStart } from './isSingleLineCommentStart.js';

export function isCommentStart(s) {
	if (isSingleLineCommentStart(s))
		return true;
	if (s.startsWith('/*'))
		return true;
	return false;
};