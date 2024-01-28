import { processTokens } from './processTokens.js';

export function printChildren(token, result, cachedParseTree) {
	processTokens(token.children, result, cachedParseTree);
};