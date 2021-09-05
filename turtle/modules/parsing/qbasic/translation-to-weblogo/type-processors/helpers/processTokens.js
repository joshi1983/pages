import { processToken } from '../processToken.js';

export function processTokens(tokens, result, options) {
	for (const child of tokens) {
		processToken(child, result, options);
		result.append(' ');
	}
};