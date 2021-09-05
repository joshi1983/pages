import { filterBrackets } from './helpers/filterBrackets.js';
import { processTokens } from './helpers/processTokens.js';

export function processInstructionList(token, result) {
	result.append(' [\n');
	result.processCommentsUpToToken(token);
	processTokens(filterBrackets(token.children), result);
	result.append('\n]\n');
};