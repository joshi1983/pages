import { processToken } from './processToken.js';

export function processBinaryOperator(token, result) {
	if (token.children.length !== 0) {
		processToken(token.children[0], result);
		result.append(` ${token.val} `);
		if (token.children.length > 1)
			processToken(token.children[1], result);
	}
};