import { filterBrackets } from './helpers/filterBrackets.js';
import { processTokens } from './helpers/processTokens.js';

export function processInstructionList(token, result, options) {
	result.append(' [\n');
	result.processCommentsUpToToken(token);
	processTokens(filterBrackets(token.children), result, options);
	result.append('\n]\n');
};