import { processTokens } from './processTokens.js';

export function printChildren(token, result, cachedParseTree, settings) {
	processTokens(token.children, result, cachedParseTree, settings);
};