import { processToken } from
'../processToken.js';

export function processTokens(tokens, result, options) {
	for (const token of tokens) {
		processToken(token, result, options);
	}
};