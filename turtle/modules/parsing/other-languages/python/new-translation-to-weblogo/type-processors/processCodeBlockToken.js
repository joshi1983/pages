import { processTokens } from './helpers/processTokens.js';

export function processCodeBlockToken(token, result, cachedParseTree, settings) {
	result.processCommentsUpToToken(token);
	processTokens(token.children, result, cachedParseTree, settings);
};