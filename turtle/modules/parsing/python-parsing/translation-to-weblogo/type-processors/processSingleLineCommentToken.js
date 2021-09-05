export function processSingleLineCommentToken(token, result, cachedParseTree) {
	result.append(`;${token.val}\n`);
};