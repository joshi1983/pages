import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const completeResult = isCompleteValueToken(token);
	if (completeResult === true)
		return false;
	if (completeResult === false)
		return true;
	if (token.type === ParseTreeTokenType.SELECTOR)
		return true;
	if (token.parentNode.type === ParseTreeTokenType.SELECTOR)
		return false;
	return false;
}

export function getGoodPreviousForSelector(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
};