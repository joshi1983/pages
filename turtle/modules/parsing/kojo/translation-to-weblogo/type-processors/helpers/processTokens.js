import { processToken } from '../processToken.js';

export function processTokens(tokens, result, settings) {
	if (!(tokens instanceof Array))
		throw new Error(`tokens must be an Array but found ${tokens}`);
	for (const token of tokens) {
		processToken(token, result, settings);
		result.append(' ');
	}
};