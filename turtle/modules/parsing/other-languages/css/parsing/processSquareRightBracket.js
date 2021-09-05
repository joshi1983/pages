import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.ATTRIBUTE_SELECTOR
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const completeResult = isCompleteValueToken(token);
	if (completeResult !== undefined)
		return !completeResult;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processSquareRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};