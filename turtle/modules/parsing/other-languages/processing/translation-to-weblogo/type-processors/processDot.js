import { processToken } from './processToken.js';

export function processDot(token, result, settings) {
	for (const child of token.children)
		processToken(child, result, settings);
};