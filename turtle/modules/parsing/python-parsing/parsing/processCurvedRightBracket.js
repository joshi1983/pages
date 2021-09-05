import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (isCompleteToken(prev))
		return false;

	return goodPrevTypes.has(prev.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processCurvedRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	const prevParent = prev.parentNode;
	if (prevParent !== null)
		return prevParent;
	return prev;
};