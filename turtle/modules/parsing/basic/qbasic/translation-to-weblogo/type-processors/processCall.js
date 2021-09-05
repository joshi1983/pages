import { processTokens } from './helpers/processTokens.js';

export function processCall(token, result, options) {
	const children = token.children;
	processTokens(token.children, result, options);
};