import { processToken } from './processToken.js';

export function processInGeneral(token, result) {
	if (token.val !== null)
		result.append(token.val);
	for (let i = 0; i < token.children.length; i++) {
		const child = token.children[i];
		processToken(child, result);
	}
};