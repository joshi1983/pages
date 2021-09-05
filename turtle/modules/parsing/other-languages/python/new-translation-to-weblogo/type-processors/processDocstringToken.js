import { getStringLiteralValue } from '../../parse-tree-analysis/variable-data-types/evaluators/getStringLiteralValue.js';

export function processDocstringToken(token, result, cachedParseTree) {
	result.append('; ' + getStringLiteralValue(token).split('\n').map(s => s.trim()).join('\n; ') + '\n');
	result.processCommentsUpToToken(token);
};