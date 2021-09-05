import { isComplete } from './isComplete.js';

export function getAboveCompletedTokens(token, functions) {
	if (!(functions instanceof Map))
		throw new Error(`Expected functions to be a Map but got ${functions}`);
	while (token.parentNode !== null && isComplete(token, functions))
		token = token.parentNode;
	return token;
};