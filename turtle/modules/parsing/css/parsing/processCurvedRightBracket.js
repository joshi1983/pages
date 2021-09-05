import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isCompleteValueToken(token))
		return false;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processCurvedRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.ARG_LIST ||
	prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return prev;
	return next;
};