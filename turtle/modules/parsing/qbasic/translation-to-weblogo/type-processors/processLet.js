import { processTokens } from './helpers/processTokens.js';

export function processLet(token, result, options) {
	result.processCommentsUpToToken(token);
	processTokens(token.children, result, options);
};