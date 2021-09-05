import { processTokens } from './processTokens.js';

export function processForever(token, result, settings) {
	result.trimRight();
	result.processCommentsUpToToken(token);
	result.trimRight();
	result.append('\nforever [\n');
	processTokens(token.children, result, settings);
	result.append('\n]\n');
};