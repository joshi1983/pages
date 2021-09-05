import { processTokens } from './helpers/processTokens.js';

export function processVar(token, result, settings) {
	result.processCommentsUpToToken(token);
	processTokens(token.children, result, settings);
	result.append('\n');
};