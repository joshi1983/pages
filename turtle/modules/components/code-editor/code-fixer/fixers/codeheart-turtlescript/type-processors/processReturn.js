import { processToken } from './processToken.js';

export function processReturn(token, result) {
	if (token.children.length === 0) {
		result.append('stop');
	}
	else {
		result.append('output ');
		processToken(token.children[0], result);
	}
};