import { processTokens } from './helpers/processTokens.js';

export function processCodeBlockToken(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	processTokens(token.children, result, cachedParseTree);
};