import { processToken } from './processToken.js';

export function processAbsoluteExpression(token, result) {
	const middleToken = token.children[1];
	if (middleToken !== undefined) {
		result.append('(abs ');
		processToken(middleToken, result);
		result.append(') ');
	}
};