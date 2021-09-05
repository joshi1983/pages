import { processToken } from '../processToken.js';

export function processTokens(tokens, result) {
	for (const child of tokens) {
		processToken(child, result);
	}
};