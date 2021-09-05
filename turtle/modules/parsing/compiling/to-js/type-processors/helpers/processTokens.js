import { processToken } from
'../processToken.js';

export function processTokens(tokens, result) {
	for (const token of tokens) {
		processToken(token, result);
	}
};