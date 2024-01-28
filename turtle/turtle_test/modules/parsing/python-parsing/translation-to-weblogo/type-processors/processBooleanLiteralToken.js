export function processBooleanLiteralToken(token, result, cachedParseTree) {
	const val = token.val;
	result.append(`${val.toLowerCase()}`);
};