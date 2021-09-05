import { processTokens } from './helpers/processTokens.js';

export function processLet(token, result) {
	processTokens(token.children, result);
};