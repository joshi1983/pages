import { processToken } from './processToken.js';

export function processTokens(tokens, result, settings) {
	if (!(tokens instanceof Array))
		throw new Error(`Expected tokens to be an Array but got ${tokens}`);
	for (const tok of tokens) {
		processToken(tok, result, settings);
	}
};