import { processToken } from './processToken.js';

export function processTreeRoot(token, result) {
	for (const child of token.children) {
		result.append('\n');
		processToken(child, result);
	}
};