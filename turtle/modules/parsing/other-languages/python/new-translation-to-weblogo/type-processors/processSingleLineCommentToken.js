import { shouldCommentLineBeRemoved } from '../shouldCommentLineBeRemoved.js';

function trimComment(s) {
	if (s[0] === '#')
		return s.substring(1);
	else
		return s.substring(3, s.length - 3);
}

export function processSingleLineCommentToken(token, result, cachedParseTree) {
	let key = 'val';
	if (token[key] === undefined)
		key = 's';
	if (!shouldCommentLineBeRemoved(token[key])) {
		result.append(`;${trimComment(token[key])}\n`);
	}
};