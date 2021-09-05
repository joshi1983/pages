import { processTokens } from './helpers/processTokens.js';

export function processLet(token, result, options) {
	processTokens(token.children, result, options);
};