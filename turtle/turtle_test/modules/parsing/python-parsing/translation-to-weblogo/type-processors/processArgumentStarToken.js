export function processArgumentStarToken(token, result, cachedParseTree) {
	result.append(`:${token.children[0].val}`);
};