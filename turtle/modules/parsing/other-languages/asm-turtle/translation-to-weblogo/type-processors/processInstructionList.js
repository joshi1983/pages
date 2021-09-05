import { processTokens } from './processTokens.js';

export function processInstructionList(token, result, settings) {
	processTokens(token.children, result, settings);
};