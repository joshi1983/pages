import { processToken } from '../processToken.js';

export function processTokens(tokens, result, settings) {
	for (const token of tokens) {
		processToken(token, result, settings);
		result.append(' ');
	}
};