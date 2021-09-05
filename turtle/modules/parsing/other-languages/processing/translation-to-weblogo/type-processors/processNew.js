import { processToken } from './processToken.js';

export function processNew(token, result, settings) {
	const children = token.children;
	for (const child of children) {
		processToken(child, result, settings);
	}
};