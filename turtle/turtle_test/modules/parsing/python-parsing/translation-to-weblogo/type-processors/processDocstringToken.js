export function processDocstringToken(token, result, cachedParseTree) {
	result.append('; ' + token.val.split('\n').map(s => s.trim()).join('\n; ') + '\n');
	result.processCommentsUpToToken(token);
};