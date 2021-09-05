import { processToken } from '../processToken.js';

export function processTokens(tokens, result, cachedParseTree, settings) {
	tokens.forEach((token) => processToken(token, result, cachedParseTree, settings));
};