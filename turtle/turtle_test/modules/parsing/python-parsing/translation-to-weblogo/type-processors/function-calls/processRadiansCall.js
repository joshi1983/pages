export function processRadiansCall(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	result.append(`\npyDegrees 2 * pi\n`);
};