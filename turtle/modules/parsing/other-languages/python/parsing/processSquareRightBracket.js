import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.SUBSCRIPT
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (!goodPrevTypes.has(prev.type))
		return false;
	if (isCompleteToken(prev))
		return false;
	return true;
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