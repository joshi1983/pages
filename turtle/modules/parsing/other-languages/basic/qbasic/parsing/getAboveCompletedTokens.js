import { isComplete } from './isComplete.js';

export function getAboveCompletedTokens(token, functions) {
	if (!(functions instanceof Map))
		throw new Error(`Expected functions to be a Map but got ${functions}`);
	if (typeof token !== 'object')
		throw new Error(`Expected token to be an object but found ${token}`);
	while (token.parentNode !== null && isComplete(token, functions))
		token = token.parentNode;
	return token;
};