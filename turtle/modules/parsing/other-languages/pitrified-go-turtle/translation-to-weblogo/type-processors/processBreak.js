export function processBreak(token, result, settings) {
	result.processCommentsUpToToken(token);
	result.append('\nbreak\n');
};