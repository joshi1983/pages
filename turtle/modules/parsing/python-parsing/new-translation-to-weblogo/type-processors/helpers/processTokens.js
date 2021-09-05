import { processToken } from '../processToken.js';

export function processTokens(tokens, result, settings) {
	tokens.forEach((token) => processToken(token, result, settings));
};