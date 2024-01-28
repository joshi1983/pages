import { processToken } from '../../processToken.js';

export function processTokens(tokens, result, cachedParseTree) {
	for (let i = 0; i < tokens.length; i++) {
		processToken(tokens[i], result, cachedParseTree);
	}
};