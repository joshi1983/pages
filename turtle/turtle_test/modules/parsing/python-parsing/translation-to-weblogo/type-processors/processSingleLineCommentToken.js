import { shouldCommentLineBeRemoved } from '../shouldCommentLineBeRemoved.js';

export function processSingleLineCommentToken(token, result, cachedParseTree) {
	if (!shouldCommentLineBeRemoved(token.val)) {
		result.append(`;${token.val}\n`);
	}
};